import { client, q } from 'app/helpers/fauna-client';
import { IAccount, IProfile } from 'app/helpers/types';
import { values } from 'faunadb';

const { Call, Function } = q;

export interface IAuthInput {
  account: IAccount;
  profile: IProfile;
}

interface IAuthResponse {
  account: values.Document<IAccount>;
  profile: values.Document<IProfile>;
  created: boolean;
  updated: boolean;
}

export default (input): Promise<IAuthResponse> =>
  client.query(Call(Function('create_or_update_account_profile'), input));
