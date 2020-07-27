// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  Equals,
  Identity,
  Select,
  Get,
  Match,
  Index,
  Var,
} = query;

module.exports = Query(
  Lambda(
    ['originalData', 'newData', 'communityProfileRef'],
    Equals(
      // community account owner
      Select(
        ['data', 'ownerAccount'],
        Get(
          Match(
            Index('community_account_by_community_profile'),
            Var('communityProfileRef')
          )
        )
      ),
      Identity()
    )
  )
);
