// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('faunadb');

const { Query, Lambda, Count, Paginate, Match, Index, Select } = query;

module.exports = {
  name: 'count_total_profiles',
  body: Query(
    Lambda(
      '_',
      Select(['data', 0], Count(Paginate(Match(Index('all_profiles'), []))))
    )
  ),
};
