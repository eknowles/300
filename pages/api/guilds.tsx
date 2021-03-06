import getUsersDiscordTokenQuery from 'app/fauna/queries/get-users-discord-token';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserGuilds, getUserToken } from 'app/helpers/api';

type Response =
  | Array<Record<'name' | 'id' | 'iconUrl', string>>
  | { message: string };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const token = getUserToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Missing or Invalid Token' });
  }

  let guilds = [];

  try {
    const discordToken = await getUsersDiscordTokenQuery(token.userAccountId);

    guilds = await getUserGuilds(discordToken);
  } catch (e) {
    console.log(e);
    return res.json([]);
  }

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
