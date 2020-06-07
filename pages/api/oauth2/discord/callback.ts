import { fetchToken, getUserData } from 'helpers/api';
import { NextApiRequest, NextApiResponse } from 'next';
import faunadb, { query as q } from 'faunadb';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const findOrCreateUser = async (id, userData) => {
  try { // find user in db -- get by id
    return await client.query(q.Get(q.Ref(q.Collection('users'), id)));
  } catch (e) { // user not found, so we create them
    return await client.query(q.Create(q.Ref(q.Collection('users'), id), { data: userData }));
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const tokens = await fetchToken(req.query.code as string);

  // get user info from discord
  const userData = await getUserData(tokens.access_token);

  // setup model
  const dbUser = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    imageUrl: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
  };

  await findOrCreateUser(dbUser.id, dbUser);

  // encode user id into jwt
  const token = jwt.sign(dbUser, process.env.JWT_SECRET);
  const jwtCookie = serialize('token', token, { path: '/', sameSite: true, secure: !!process.env.IS_PROD })

  // set cookie and redirect to dashboard
  res.writeHead(302, {
    'Set-Cookie': jwtCookie,
    'Location': '/dashboard'
  });

  res.end();
}
