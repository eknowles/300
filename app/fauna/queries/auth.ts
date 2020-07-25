import { client, q } from 'app/helpers/fauna-client';
import {
  IUserAccount,
  IUserProfile,
  IDiscordOAuth2TokenResponse,
} from 'app/helpers/types';
import { values } from 'faunadb';

const { Call, Function } = q;

export interface IAuthInput {
  userAccount: IUserAccount;
  userProfile: IUserProfile;
  discordToken: IDiscordOAuth2TokenResponse;
}

interface IAuthResponse {
  userAccount: values.Document<IUserAccount>;
  userProfile: values.Document<IUserProfile>;
  created: boolean;
  updated: boolean;
}

export default (input: IAuthInput): Promise<IAuthResponse> =>
  client.query(Call(Function('create_or_update_user_account_profile'), input));
