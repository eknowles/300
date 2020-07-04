import faunaAuth from 'app/fauna/queries/auth';
import UpdateAccountWithStripeId from 'app/fauna/queries/update-account-with-stripe-id';
import { client, q } from 'app/helpers/fauna-client';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import {
  CallbackPath,
  discordApiUrl,
  exchangeCodeForToken,
  getUserData,
} from 'app/helpers/api';
import Stripe from 'stripe';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.cookies;

  if (token) {
    try {
      // check if user is already authed
      jwt.verify(token, process.env.JWT_SECRET);
      res.writeHead(302, { Location: '/dashboard' });

      return res.end();
    } catch (e) {
      // token is invalid so we ignore and re-auth with discord
    }
  }

  if (req.query.code) {
    // request is a callback
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
        avatar &&
        `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`,
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

    const faunaToken = await client.query<{ secret: string }>(
      q.Do(q.Create(q.Tokens(), { instance: dbRes.userAccount.ref }))
    );

    const jwtPayload = {
      userAccountId: dbRes.userAccount.ref.id,
      userProfileId: dbRes.userProfile.ref.id,
      discordId,
      userProfile,
      key: faunaToken.secret,
    };

    // encode user id into jwt
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET);
    const jwtCookie = serialize('token', jwtToken, {
      path: '/',
      sameSite: true,
      secure: !!process.env.IS_PROD,
    });

    // set cookie and redirect to dashboard
    res.writeHead(302, {
      'Set-Cookie': jwtCookie,
      Location: `/dashboard`,
    });

    return res.end();
  }

  // pass to login
  const params = {
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: `${process.env.ROOT_DOMAIN}/api/oauth2/${CallbackPath.login}`,
    response_type: 'code',
    scope: 'identify email',
  };

  const url = `${discordApiUrl}/oauth2/authorize?${qs.stringify(params)}`;

  res.writeHead(302, { Location: url });

  return res.end();
};
