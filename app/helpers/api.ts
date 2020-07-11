import axios from 'axios';
import { NextApiRequest } from 'next';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import {
  IDiscordGuild,
  IDiscordOAuth2TokenResponse,
  IDiscordUserMeResponse,
  IUserTokenJwt,
} from './types';

export const discordApiUrl = 'https://discord.com/api';

const instance = axios.create({
  baseURL: `${discordApiUrl}/v6`,
  timeout: 3000,
});

export enum CallbackPath {
  login = 'discord/login',
  bot = 'discord/bot',
}

export async function exchangeCodeForToken(
  code: string,
  callbackPath: CallbackPath
): Promise<IDiscordOAuth2TokenResponse> {
  const callback = {
    grant_type: 'authorization_code',
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    redirect_uri: `${process.env.ROOT_DOMAIN}/api/oauth2/${callbackPath}`,
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

export function getUserToken(req: NextApiRequest): IUserTokenJwt | null {
  const { token } = req.cookies;

  if (!token) {
    return null;
  }

  try {
    const decodedJwt: IUserTokenJwt = jwt.verify(token, process.env.JWT_SECRET);
    return decodedJwt;
  } catch (e) {
    return null;
  }
}
