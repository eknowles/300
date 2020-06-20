const faunadb = require('faunadb');
const q = faunadb.query;
const { CreateRole, Role, If, Exists, Update } = q;

// A convenience function to either create or update a role.
function CreateOrUpdateRole(obj) {
  return If(
    Exists(Role(obj.name)),
    Update(Role(obj.name), {
      membership: obj.membership,
      privileges: obj.privileges,
    }),
    CreateRole(obj)
  );
}

// This role.. can't do anything. It's used as an example in the tests
const CreatePowerlessRole = CreateOrUpdateRole({
  name: 'powerless',
  privileges: [],
});
