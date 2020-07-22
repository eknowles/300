/* eslint-disable @typescript-eslint/no-var-requires, no-console */
require('dotenv').config();
const { Client, query } = require('faunadb');

const {
  Map,
  Let,
  Lambda,
  Paginate,
  Var,
  Delete,
  Functions,
  Roles,
  Collections,
  Indexes,
} = query;

async function main() {
  const client = new Client({ secret: process.env.FAUNADB_SECRET });

  await client.query(
    Let(
      {
        deleteIndex: Map(Paginate(Indexes()), Lambda('X', Delete(Var('X')))),
        deleteCollections: Map(
          Paginate(Collections()),
          Lambda('X', Delete(Var('X')))
        ),
        deleteFunctions: Map(
          Paginate(Functions()),
          Lambda('X', Delete(Var('X')))
        ),
        // deleteRoles: Map(Paginate(Roles()), Lambda('X', Delete(Var('X')))),
      },
      {
        results: true,
      }
    )
  );
}

main().catch((e) => console.error(e));
