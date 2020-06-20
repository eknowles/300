import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import { discordApiUrl } from 'app/helpers/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (req: NextApiRequest, res: NextApiResponse) => {
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

  // pass to login
  const params = {
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: `${process.env.ROOT_DOMAIN}/api/oauth2/discord/callback`,
    response_type: 'code',
    scope: 'identify email connections guilds guilds.join',
  };

  const url = `${discordApiUrl}/oauth2/authorize?${qs.stringify(params)}`;

  res.writeHead(302, { Location: url });
  return res.end();
};
