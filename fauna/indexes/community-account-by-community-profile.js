// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Collection } = query;

module.exports = {
  name: 'community_account_by_community_profile',
  unique: true,
  serialized: true,
  source: Collection('community_accounts'),
  terms: [
    {
      field: ['data', 'communityProfile'],
    },
  ],
};
