const faunadb = require('faunadb');
const q = faunadb.query;
const {
  If,
  Lambda,
  Merge,
  Update,
  Let,
  Var,
  Create,
  Collection,
  Select,
  Query,
  Match,
  Get,
  Index,
  Count,
  Exists,
  Paginate,
} = q;

// This counts up the number of profiles in the all_profiles index
const TotalProfiles = () => {
  return Query(
    Lambda(
      '_',
      Select(['data', 0], Count(Paginate(Match(Index('all_profiles'), []))))
    )
  );
};

const CreateOrUpdateAccountProfile = () =>
  Query(
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
  );

module.exports = {
  CreateOrUpdateAccountProfile,
  TotalProfiles,
};
