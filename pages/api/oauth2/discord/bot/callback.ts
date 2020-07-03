import { NextApiRequest, NextApiResponse } from 'next';
import faunaCommunityAuth from 'app/fauna/queries/community-auth';
import { CallbackPath, exchangeCodeForToken } from 'app/helpers/api';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const discordToken = await exchangeCodeForToken(
    req.query.code as string,
    CallbackPath.bot
  );

  discordToken.guild.icon =
    discordToken.guild.icon &&
    `https://cdn.discordapp.com/icons/${discordToken.guild.id}/${discordToken.guild.icon}.png`;

  await faunaCommunityAuth(discordToken);

  res.writeHead(302, {
    Location: `/dashboard`,
  });

  return res.end();
};
