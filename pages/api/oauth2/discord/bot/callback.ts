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

  await faunaCommunityAuth(discordToken);

  res.writeHead(302, {
    Location: `/dashboard`,
  });

  return res.end();
};
