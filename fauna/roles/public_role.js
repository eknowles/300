/* eslint-disable @typescript-eslint/no-var-requires */
const { query } = require('faunadb');

const { Collection, Index, Function } = query;

module.exports = {
  name: 'public_role',
  privileges: [
    {
      resource: Collection('user_profiles'),
      actions: {
        read: true,
      },
    },
    {
      resource: Collection('community_profiles'),
      actions: {
        read: true,
      },
    },
    {
      resource: Index('all_user_profiles'),
      actions: {
        unrestricted_read: true,
      },
    },
    {
      resource: Index('all_community_profiles'),
      actions: {
        unrestricted_read: true,
      },
    },
    {
      resource: Function('count_total_profiles'),
      actions: {
        call: true,
      },
    },
    {
      resource: Function('count_total_communities'),
      actions: {
        call: true,
      },
    },
  ],
};
