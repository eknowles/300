import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';
import { CallbackPath, discordApiUrl } from 'app/helpers/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (req: NextApiRequest, res: NextApiResponse) => {
  const params: any = {
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: `${process.env.ROOT_DOMAIN}/api/oauth2/${CallbackPath.bot}`,
    response_type: 'code',
    scope: 'bot',
    permissions: 8,
  };

  if (req.query.guildId) {
    params.guild_id = req.query.guildId;
    params.disable_guild_select = true;
  }

  const url = `${discordApiUrl}/oauth2/authorize?${qs.stringify(params)}`;

  res.writeHead(302, { Location: url });
  return res.end();
};
