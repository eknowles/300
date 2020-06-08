import faunadb, { query as q } from 'faunadb';

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

export { q, client };
