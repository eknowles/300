// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Query, If, HasIdentity, Get, Identity, Select, Lambda } = query;

module.exports = {
  name: 'my_profile',
  body: Query(
    Lambda(
      '_',
      If(
        HasIdentity(),
        Get(Select(['data', 'userProfile'], Get(Identity()))),
        null
      )
    )
  ),
};
