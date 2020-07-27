// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  Equals,
  Identity,
  Var,
  Ref,
  Collection,
  Get,
  Select,
} = query;

module.exports = Query(
  Lambda(
    ['userProfileId', 'communityId'],
    Equals(
      Ref(Collection('user_profiles'), Var('userProfileId')),
      Select(['data', 'userProfile'], Get(Identity()))
    )
  )
);
