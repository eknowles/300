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
  name: 'create_or_update_account_profile',
  body: Query(
    Lambda(
      'input',
      If(
        // 1. check if user exists
        Exists(
          Match(
            Index('account_by_discordid'),
            Select(['account', 'discordId'], Var('input'))
          )
        ),
        // 2. if account is found, update with new oauth tokens
        Let(
          {
            account: Get(
              Match(
                Index('account_by_discordid'),
                Select(['account', 'discordId'], Var('input'))
              )
            ),
            updatedAccount: Update(Select(['ref'], Var('account')), {
              data: {
                discordToken: Select(['account', 'discordToken'], Var('input')),
              },
            }),
            updatedProfile: Update(
              Select(['data', 'profile'], Var('account')),
              {
                data: Select(['profile'], Var('input')),
              }
            ),
          },
          {
            account: Var('updatedAccount'),
            profile: Var('updatedProfile'),
            updated: true,
            created: false,
          }
        ),
        // 2. create profile, create account and add profile to account
        Let(
          {
            newProfile: Create(Collection('profiles'), {
              data: Select(['profile'], Var('input')),
            }),
            newAccount: Create(Collection('accounts'), {
              data: Merge(Select(['account'], Var('input')), {
                profile: Select(['ref'], Var('newProfile')),
              }),
            }),
          },
          {
            profile: Var('newProfile'),
            account: Var('newAccount'),
            updated: false,
            created: true,
          }
        )
      )
    )
  ),
};
