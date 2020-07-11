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

const defaultBannerUrl =
  'https://images.unsplash.com/photo-1483428400520-675ef69a3bc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3264&q=80';
const defaultSplashUrl =
  'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2253&q=80';

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
                      bannerUrl: defaultBannerUrl,
                      splashUrl: defaultSplashUrl,
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
                updateCommunityProfileWithAccount: Update(
                  Select(['ref'], Var('createdCommunityProfile')),
                  {
                    data: {
                      communityAccount: Select(
                        ['ref'],
                        Var('createdCommunityAccount')
                      ),
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
                  Var('updateCommunityProfileWithAccount')
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
