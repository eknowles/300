import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getUserGuilds } from 'app/helpers/api';
import { client, q } from 'app/helpers/fauna-client';

type Response =
  | Array<Record<'name' | 'id' | 'iconUrl', string>>
  | { message: string };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await client.query<any>(
    q.Get(q.Ref(q.Collection('accounts'), decoded.accountId))
  );
  const guilds = await getUserGuilds(user.data.discordToken.access_token);
  const ownedGuilds = guilds
    .filter((g) => g.owner)
    .map((g) => ({
      name: g.name,
      id: g.id,
      iconUrl:
        g.icon && `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`,
    }));

  return res.json(ownedGuilds);
};
