import { client, q } from 'app/helpers/fauna-client';
import { IUserAccount, IUserProfile } from 'app/helpers/types';
import { values } from 'faunadb';

const { Call, Function } = q;

export interface IAuthInput {
  userAccount: IUserAccount;
  userProfile: IUserProfile;
  discordToken: any;
}

interface IAuthResponse {
  userAccount: values.Document<IUserAccount>;
  userProfile: values.Document<IUserProfile>;
  created: boolean;
  updated: boolean;
}

export default (input): Promise<IAuthResponse> =>
  client.query(Call(Function('create_or_update_user_account_profile'), input));
