/* eslint-disable @typescript-eslint/no-var-requires */
const { query } = require('faunadb');
const OnlyUpdateProfileIfOwner = require('../predicates/only-update-profile-if-owner');

const { Collection, Index, Function } = query;

module.exports = {
  name: 'user_account_role',
  membership: [{ resource: Collection('user_accounts') }],
  privileges: [
    {
      resource: Collection('user_profiles'),
      actions: {
        read: true,
        write: OnlyUpdateProfileIfOwner,
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
