// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  If,
  Exists,
  Match,
  Let,
  Get,
  Index,
  Select,
  Var,
  Update,
  Create,
  Now,
  Collection,
} = query;

module.exports = {
  name: 'create_or_update_community_account_profile',
  body: Query(
    Lambda(
      'input',
      Let(
        {
          communityAccountSet: Match(
            Index('community_account_by_discordid'),
            Select(['guild', 'id'], Var('input'))
          ),
          guildOwnerAccount: Get(
            Match(
              Index('user_account_by_discordid'),
              Select(['guild', 'owner_id'], Var('input'))
            )
          ),
        },
        {
          result: If(
            Exists(Var('communityAccountSet')),
            // Update
            Let(
              {
                fetchedCommunityAccount: Get(Var('communityAccountSet')),
                updatedCommunityDiscordToken: Update(
                  Select(
                    ['data', 'discordToken'],
                    Var('fetchedCommunityAccount')
                  ),
                  {
                    data: {
                      access_token: Select(['access_token'], Var('input')),
                      refresh_token: Select(['refresh_token'], Var('input')),
                      token_type: Select(['token_type'], Var('input')),
                      scope: Select(['scope'], Var('input')),
                      expires_in: Select(['expires_in'], Var('input')),
                    },
                  }
                ),
              },
              {
                communityAccount: Select(
                  ['ref'],
                  Var('fetchedCommunityAccount')
                ),
                communityProfile: Select(
                  ['data', 'communityProfile'],
                  Var('fetchedCommunityAccount')
                ),
                created: false,
              }
            ),
            // Create
            Let(
              {
                createdCommunityDiscordToken: Create(
                  Collection('discord_bot_tokens'),
                  {
                    data: {
                      access_token: Select(['access_token'], Var('input')),
                      refresh_token: Select(['refresh_token'], Var('input')),
                      token_type: Select(['token_type'], Var('input')),
                      scope: Select(['scope'], Var('input')),
                      expires_in: Select(['expires_in'], Var('input')),
                    },
                  }
                ),
                createdCommunityProfile: Create(
                  Collection('community_profiles'),
                  {
                    data: {
                      name: Select(['guild', 'name'], Var('input')),
                      region: 'EU',
                      countryCode: 'GB',
                      localeCode: 'EN',
                      iconUrl: Select(['guild', 'icon'], Var('input')),
                    },
                  }
                ),
                createdCommunityAccount: Create(
                  Collection('community_accounts'),
                  {
                    data: {
                      discordId: Select(['guild', 'id'], Var('input')),
                      discordToken: Select(
                        ['ref'],
                        Var('createdCommunityDiscordToken')
                      ),
                      communityProfile: Select(
                        ['ref'],
                        Var('createdCommunityProfile')
                      ),
                      ownerAccount: Select(['ref'], Var('guildOwnerAccount')),
                    },
                  }
                ),
                createOwnerMembership: Create(Collection('memberships'), {
                  data: {
                    userProfile: Select(
                      ['data', 'userProfile'],
                      Var('guildOwnerAccount')
                    ),
                    communityProfile: Select(
                      ['ref'],
                      Var('createdCommunityProfile')
                    ),
                    role: 'OWNER',
                    createdAt: Now(),
                  },
                }),
              },
              {
                communityAccount: Select(
                  ['ref'],
                  Var('createdCommunityAccount')
                ),
                communityProfile: Select(
                  ['ref'],
                  Var('createdCommunityProfile')
                ),
                created: true,
              }
            )
          ),
        }
      )
    )
  ),
};
