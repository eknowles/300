// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  Let,
  Ref,
  Call,
  Function,
  Collection,
  Abort,
  Get,
  Select,
  Exists,
  HasIdentity,
  And,
  Var,
  Identity,
  If,
} = query;

// Check if user is member of community, if so return obj, otherwise create a ROOKIE role in the community
module.exports = {
  name: 'join_community_mutation',
  role: 'admin',
  body: Query(
    Lambda(
      ['communityProfileId'],
      If(
        And(
          HasIdentity(),
          Exists(
            Ref(Collection('community_profiles'), Var('communityProfileId'))
          )
        ),
        Let(
          {
            userProfileId: Select(
              ['data', 'userProfile', 'id'],
              Get(Identity())
            ),
          },
          Call(Function('join_community'), [
            Var('userProfileId'),
            Var('communityProfileId'),
          ])
        ),
        Abort('User or Profile Not Found')
      )
    )
  ),
};
