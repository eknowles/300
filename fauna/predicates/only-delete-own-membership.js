// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const {
  Query,
  Lambda,
  And,
  Equals,
  Identity,
  Var,
  Get,
  Select,
  Let,
  Not,
} = query;

module.exports = Query(
  Lambda(
    'membershipRef',
    Let(
      { membership: Get(Var('membershipRef')) },
      And(
        Equals(
          Select(['data', 'userProfile'], Var('membership')),
          Select(['data', 'userProfile'], Get(Identity()))
        ),
        Not(Equals(Select(['data', 'role'], Var('membership')), 'OWNER'))
      )
    )
  )
);
