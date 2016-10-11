const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const pgp = require('pg-promise')();
const connection = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'postgres',
};
const db = pgp(connection);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

  input Ordering {
    sort: String! = "id"
    direction: Direction! = ASC
  }
  enum Direction { ASC, DESC }

  input GroupInput {
    title: String!,
    description: String
  }
  type Group {
    id: ID!,
    title: String!,
    description: String,
    created_at: String!,
    updated_at: String
  }

  type Query {
    groups(limit: Int = 10, offset: Int = 0, orderBy: [Ordering!]): [Group]
  }
  type Mutation {
    addGroup(input: GroupInput): Group,
    updateGroup(id: ID!, input: GroupInput): Group
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  groups: (args) => {
    return db.any("SELECT * from groups ORDER BY $3:name $4:raw LIMIT $1 OFFSET $2;", [
      args.limit,
      args.offset,
      args.orderBy[0].sort,
      args.orderBy[0].direction
    ]);
  },
  addGroup: (args) => {
    return db.one(`
      INSERT INTO groups (title, description, created_at)
      VALUES ($1, $2, NOW())
      RETURNING *`, [
        args.input.title,
        args.input.description
      ])
  },
  updateGroup: (args) => {
    return db.one(`
      UPDATE groups SET title = $1, description = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *;`, [
        args.input.title,
        args.input.description,
        args.id
      ]);
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8889, '0.0.0.0');
console.log('Running a GraphQL API server at 0.0.0.0:8889/');
