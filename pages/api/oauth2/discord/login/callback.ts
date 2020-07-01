import UpdateAccountWithStripeId from 'app/fauna/queries/update-account-with-stripe-id';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import faunaAuth from 'app/fauna/queries/auth';
import {
  CallbackPath,
  exchangeCodeForToken,
  getUserData,
} from 'app/helpers/api';
import Stripe from 'stripe';
import { client, q } from 'app/helpers/fauna-client';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const discordToken = await exchangeCodeForToken(
    req.query.code as string,
    CallbackPath.login
  );

  // get user info from discord
  const {
    id: discordId,
    locale: localeCode,
    username,
    email,
    avatar,
  } = await getUserData(discordToken.access_token);

  const userAccount = {
    email,
    discordId,
  };

  const userProfile = {
    username,
    avatarUrl:
      avatar && `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`,
    localeCode,
  };

  const input = { userAccount, userProfile, discordToken };

  const dbRes = await faunaAuth(input);

  // For new accounts, create a Stripe Customer
  if (dbRes.created) {
    // Setup Stripe API
    const s = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-03-02',
    });

    // Make API Call
    const customer = await s.customers.create({
      email,
      preferred_locales: [localeCode],
      metadata: {
        discordId,
        username,
      },
    });

    // Save new customer ID to account collection
    await UpdateAccountWithStripeId(dbRes.userAccount.ref.id, customer.id);
  }

  const faunaToken = await client.query(
    q.Do(q.Create(q.Tokens(), { instance: dbRes.userAccount.ref }))
  );

  console.log(faunaToken);

  const jwtPayload = {
    userAccountId: dbRes.userAccount.ref.id,
    userProfileId: dbRes.userProfile.ref.id,
    discordId,
    userProfile,
  };

  // encode user id into jwt
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
  const jwtCookie = serialize('token', token, {
    path: '/',
    sameSite: true,
    secure: !!process.env.IS_PROD,
  });

  // set cookie and redirect to dashboard
  res.writeHead(302, {
    'Set-Cookie': jwtCookie,
    Location: `/dashboard`,
  });

  res.end();
};
