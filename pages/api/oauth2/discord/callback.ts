import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import faunaAuth from 'app/fauna/queries/auth';
import { fetchToken, getUserData } from 'app/helpers/api';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const discordToken = await fetchToken(req.query.code as string);

  // get user info from discord
  const {
    id: discordId,
    locale: localeCode,
    username,
    email,
    avatar,
  } = await getUserData(discordToken.access_token);

  const account = {
    email,
    discordId,
    discordToken,
  };

  const profile = {
    username,
    avatarUrl:
      avatar && `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`,
    localeCode,
  };

  const input = { account, profile };

  const dbRes = await faunaAuth(input);

  const jwtPayload = {
    accountId: dbRes.account.ref.id,
    profileId: dbRes.profile.ref.id,
    discordId,
    profile,
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
