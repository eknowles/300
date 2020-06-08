import { getUserGuilds } from 'helpers/api';
import { client, q } from 'helpers/fauna-client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await client.query<any>(q.Get(q.Ref(q.Collection('User'), decoded.id)));
  const guilds = await getUserGuilds(user.data.discordTokens.access_token);

  const ownedGuilds = guilds.filter((g) => g.owner);

  return res.json(ownedGuilds);
}
