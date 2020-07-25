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
  Collection,
  Merge,
} = query;

module.exports = {
  name: 'create_or_update_user_account_profile',
  role: 'admin',
  body: Query(
    Lambda(
      'input',
      If(
        // 1. check if user exists
        Exists(
          Match(
            Index('user_account_by_discordid'),
            Select(['userAccount', 'discordId'], Var('input'))
          )
        ),
        // 2. if account is found, update with new oauth tokens
        Let(
          {
            userAccount: Get(
              Match(
                Index('user_account_by_discordid'),
                Select(['userAccount', 'discordId'], Var('input'))
              )
            ),
            updatedUserDiscordToken: Update(
              Select(['data', 'discordToken'], Var('userAccount')),
              {
                data: Select(['discordToken'], Var('input')),
              }
            ),
            updatedUserProfile: Update(
              Select(['data', 'userProfile'], Var('userAccount')),
              {
                data: Select(['userProfile'], Var('input')),
              }
            ),
          },
          {
            userAccount: Var('userAccount'),
            userProfile: Var('updatedUserProfile'),
            created: false,
          }
        ),
        // 2. create profile, create account and add profile to account
        Let(
          {
            userDiscordToken: Create(Collection('discord_user_tokens'), {
              data: Select(['discordToken'], Var('input')),
            }),
            newUserProfile: Create(Collection('user_profiles'), {
              data: Select(['userProfile'], Var('input')),
            }),
            newUserAccount: Create(Collection('user_accounts'), {
              data: Merge(Select(['userAccount'], Var('input')), {
                userProfile: Select(['ref'], Var('newUserProfile')),
                discordToken: Select(['ref'], Var('userDiscordToken')),
              }),
            }),
            updatedUserProfile: Update(Select(['ref'], Var('newUserProfile')), {
              data: {
                userAccount: Select(['ref'], Var('newUserAccount')),
              },
            }),
          },
          {
            userAccount: Var('newUserAccount'),
            userProfile: Var('updatedUserProfile'),
            created: true,
          }
        )
      )
    )
  ),
};
