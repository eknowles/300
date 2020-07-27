// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  Equals,
  Get,
  Identity,
  Var,
  Match,
  Index,
  Select,
  Collection,
  Ref,
  If,
  HasIdentity,
} = query;

module.exports = {
  name: 'permission_can_update_community',
  role: 'admin',
  body: Query(
    Lambda(
      ['communityProfileId'],
      If(
        HasIdentity(),
        Equals(
          // community account owner
          Select(
            ['data', 'ownerAccount'],
            Get(
              Match(
                Index('community_account_by_community_profile'),
                Ref(Collection('community_profiles'), Var('communityProfileId'))
              )
            )
          ),
          Identity()
        ),
        false
      )
    )
  ),
};
