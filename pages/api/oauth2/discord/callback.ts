import { fetchToken, getUserData } from 'helpers/api';
import { client, q } from 'helpers/fauna-client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const findOrCreateUser = async (id, userData) => {
  try { // find user in db -- get by id
    return await client.query(q.Update(q.Ref(q.Collection('User'), id), { data: userData }));
  } catch (e) { // user not found, so we create them
    return await client.query(q.Create(q.Ref(q.Collection('User'), id), { data: userData }));
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const discordTokens = await fetchToken(req.query.code as string);

  // get user info from discord
  const userData = await getUserData(discordTokens.access_token);

  const profile = {
    username: userData.username,
    avatar: userData.avatar && `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
    locale: userData.locale,
  };

  // setup model
  const dbUser = {
    id: userData.id,
    email: userData.email,
    discordTokens,
    profile
  };

  const resp = await findOrCreateUser(dbUser.id, dbUser);

  console.log(resp);

  const jwtPayload = {
    id: dbUser.id,
    email: userData.email,
    ...profile,
  }

  // encode user id into jwt
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);
  const jwtCookie = serialize('token', token, { path: '/', sameSite: true, secure: !!process.env.IS_PROD })

  // set cookie and redirect to dashboard
  res.writeHead(302, {
    'Set-Cookie': jwtCookie,
    'Location': '/dashboard'
  });

  res.end();
}
