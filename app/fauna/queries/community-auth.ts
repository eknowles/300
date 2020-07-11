import { client, q } from 'app/helpers/fauna-client';
import { IDiscordOAuth2TokenResponse } from 'app/helpers/types';
import { values } from 'faunadb';

const { Call, Function } = q;

interface ICommunityAuthResponse {
  communityAccount: values.Ref;
  communityProfile: values.Ref;
  created: boolean;
}

export default (
  input: IDiscordOAuth2TokenResponse
): Promise<{ result: ICommunityAuthResponse }> =>
  client.query(
    Call(Function('create_or_update_community_account_profile'), input)
  );
