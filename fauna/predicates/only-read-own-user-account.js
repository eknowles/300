// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Query, Lambda, Equals, Identity, Var } = query;

module.exports = Query(Lambda(['ref'], Equals(Var('ref'), Identity())));
