/* eslint-disable @typescript-eslint/no-var-requires */
const { query } = require('faunadb');
const OnlyUpdateProfileIfOwner = require('../predicates/only-update-profile-if-owner');
const OnlyReadOwnUserAccount = require('../predicates/only-read-own-user-account');
const publicRole = require('./public_role');

const { Collection, Function } = query;

module.exports = {
  name: 'user_account_role',
  membership: [{ resource: Collection('user_accounts') }],
  privileges: [
    ...publicRole.privileges,
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
      resource: Function('my_profile'),
      actions: {
        call: true,
      },
    },
  ],
};
