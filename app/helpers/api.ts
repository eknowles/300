import axios from 'axios';
import qs from 'qs';
import {
  IDiscordGuild,
  IDiscordOAuth2TokenResponse,
  IDiscordUserMeResponse,
} from './types';

export const discordApiUrl = 'https://discord.com/api';

const instance = axios.create({
  baseURL: `${discordApiUrl}/v6`,
  timeout: 3000,
});

export async function fetchToken(
  code: string
): Promise<IDiscordOAuth2TokenResponse> {
  const callback = {
    grant_type: 'authorization_code',
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    redirect_uri: `${process.env.ROOT_DOMAIN}/api/oauth2/discord/callback`,
    code,
  };

  const { data: result } = await instance.request<IDiscordOAuth2TokenResponse>({
    url: `/oauth2/token`,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(callback),
  });

  return result;
}

export async function getUserData(
  token: string
): Promise<IDiscordUserMeResponse> {
  const { data: result } = await instance.request<IDiscordUserMeResponse>({
    url: `/users/@me`,
    headers: { Authorization: `Bearer ${token}` },
  });

  return result;
}

export async function getUserGuilds(token: string): Promise<IDiscordGuild[]> {
  const { data: result } = await instance.request<IDiscordGuild[]>({
    url: `/users/@me/guilds`,
    headers: { Authorization: `Bearer ${token}` },
  });

  return result;
}
