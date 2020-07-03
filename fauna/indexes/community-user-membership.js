// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Collection } = query;

module.exports = {
  name: 'community_user_membership',
  unique: true,
  serialized: true,
  source: Collection('memberships'),
  terms: [
    {
      field: ['data', 'userProfile'],
    },
    {
      field: ['data', 'communityProfile'],
    },
  ],
};
