import { client, q } from 'app/helpers/fauna-client';

const getUsersDiscordTokenQuery = (accountId: string) =>
  client.query<any>(
    q.Select(
      ['data', 'access_token'],
      q.Get(
        q.Select(
          ['data', 'discordToken'],
          q.Get(q.Ref(q.Collection('user_accounts'), accountId))
        )
      )
    )
  );

export default getUsersDiscordTokenQuery;
