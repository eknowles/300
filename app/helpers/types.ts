/* eslint-disable camelcase */
export interface IDiscordUserMeResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  email: string;
  verified: boolean;
  locale: string;
  mfa_enabled: boolean;
}

export interface IDiscordOAuth2TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  guild?: any;
}

export interface IDiscordGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
}

export interface IUserAccount {
  email: string;
  discordId: string;
  discordToken: any;
}

export interface IUserProfile {
  username: string;
  avatarUrl: string;
  localeCode: string;
}
