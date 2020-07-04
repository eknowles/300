// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  Let,
  Ref,
  Match,
  Index,
  Collection,
  Abort,
  Get,
  Create,
  Exists,
  And,
  Var,
  If,
} = query;

// Check if user is member of community, if so return obj, otherwise create a ROOKIE role in the community
module.exports = {
  name: 'join_community',
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
            Exists(Var('membership')),
            Get(Var('membership')),
            Create(Collection('memberships'), {
              data: {
                role: 'ROOKIE',
                userProfile: Ref(
                  Collection('user_profiles'),
                  Var('userProfileId')
                ),
                communityProfile: Ref(
                  Collection('community_profiles'),
                  Var('communityId')
                ),
              },
            })
          )
        ),
        Abort('User or Profile Not Found')
      )
    )
  ),
};
