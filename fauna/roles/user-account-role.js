/* eslint-disable @typescript-eslint/no-var-requires */
const { query } = require('faunadb');
const OnlyUpdateProfileIfOwner = require('../predicates/only-update-profile-if-owner');
const OnlyReadOwnUserAccount = require('../predicates/only-read-own-user-account');
const OnlyDeleteOwnMembership = require('../predicates/only-delete-own-membership');
const OnlyCommunityOwnerCanUpdate = require('../predicates/only-community-owner-can-update');

const { Query, Lambda, Equals, Identity, Var, Get, Select } = query;
const { Collection, Function, Index } = query;

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
      resource: Collection('user_accounts'),
      actions: {
        read: OnlyReadOwnUserAccount,
      },
    },
    {
      resource: Collection('memberships'),
      actions: {
        delete: OnlyDeleteOwnMembership,
      },
    },
    {
      resource: Function('my_profile'),
      actions: {
        call: true,
      },
    },
    {
      resource: Function('leave_community'),
      actions: {
        call: true,
      },
    },
    {
      resource: Function('join_community_mutation'),
      actions: {
        call: true,
      },
    },
    {
      resource: Collection('community_profiles'),
      actions: {
        write: OnlyCommunityOwnerCanUpdate,
      },
    },
    {
      resource: Collection('community_accounts'),
      actions: {
        read: Query(
          Lambda(
            ['ref'],
            Equals(
              Select(['data', 'ownerAccount'], Get(Var('ref'))),
              Identity()
            )
          )
        ),
      },
    },
    {
      resource: Index('community_account_by_community_profile'),
      actions: {
        unrestricted_read: true,
      },
    },
  ],
};
