// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Collection } = query;

module.exports = {
  name: 'community_premium_membership',
  serialized: true,
  source: Collection('memberships'),
  terms: [
    {
      field: ['data', 'communityProfile'],
    },
    {
      field: ['data', 'isPremium'],
    },
  ],
};
