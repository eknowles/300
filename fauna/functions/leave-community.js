// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  Let,
  Ref,
  Match,
  Index,
  Delete,
  Collection,
  Abort,
  Exists,
  And,
  Var,
  Not,
  Equals,
  Get,
  Select,
  If,
} = query;

module.exports = {
  name: 'leave_community',
  body: Query(
    Lambda(
      ['userProfileId', 'communityId'],
      If(
        And(
          Exists(Ref(Collection('user_profiles'), Var('userProfileId'))),
          Exists(Ref(Collection('community_profiles'), Var('communityId')))
        ),
        Let(
          {
            membership: Match(Index('community_user_membership'), [
              Ref(Collection('user_profiles'), Var('userProfileId')),
              Ref(Collection('community_profiles'), Var('communityId')),
            ]),
          },
          If(
            And(
              Exists(Var('membership')),
              Not(
                Equals(
                  Select(['data', 'role'], Get(Var('membership'))),
                  'OWNER'
                )
              )
            ),
            Delete(Var('membership')),
            Abort('Membership does not exist or user is owner of community')
          )
        ),
        Abort('User or Profile Not Found')
      )
    )
  ),
};
