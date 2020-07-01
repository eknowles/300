// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Query, Lambda, Equals, Identity, Select, Get, Var } = query;

module.exports = Query(
  Lambda(
    'userProfileRef',
    Equals(
      Var('userProfileRef'),
      Select(['data', 'userProfile'], Get(Identity()))
    )
  )
);
