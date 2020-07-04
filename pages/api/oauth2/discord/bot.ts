import faunaCommunityAuth from 'app/fauna/queries/community-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';
import {
  CallbackPath,
  discordApiUrl,
  exchangeCodeForToken,
} from 'app/helpers/api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.code) {
    // callback
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
  }

  // not callback
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
