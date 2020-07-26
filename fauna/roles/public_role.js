/* eslint-disable @typescript-eslint/no-var-requires */
const { query } = require('faunadb');

const { Collection, Index, Function } = query;

module.exports = {
  name: 'public_role',
  membership: [{ resource: Collection('user_accounts') }],
  privileges: [
    {
      resource: Collection('memberships'),
      actions: {
        read: true,
      },
    },
    {
      resource: Index('user_profile_memberships_by_userProfile'),
      actions: {
        unrestricted_read: true,
      },
    },
    {
      resource: Index('community_profile_membership_by_communityProfile'),
      actions: {
        unrestricted_read: true,
      },
    },
    {
      resource: Index('community_premium_membership'),
      actions: {
        unrestricted_read: true,
      },
    },
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
      resource: Function('count_total_user_profiles'),
      actions: {
        call: true,
      },
    },
    {
      resource: Function('count_total_community_profiles'),
      actions: {
        call: true,
      },
    },
    {
      resource: Function('permission_can_update_community'),
      actions: {
        call: true,
      },
    },
  ],
};
