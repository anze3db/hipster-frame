const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const pgp = require('pg-promise')();
const connection = {
  user: process.env.DB_ENV_POSTGRES_USER,
  password: process.env.DB_ENV_POSTGRES_PASSWORD,
  host: process.env.DB_PORT_5432_TCP_ADDR,
  port: process.env.DB_PORT_5432_TCP_PORT,
  database: 'postgres',
};
const db = pgp(connection);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return db.any("SELECT * from groups;")
    .then(function (data) {
        return data[0].title
    });
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8889, '0.0.0.0');
console.log('Running a GraphQL API server at 0.0.0.0:8889/');
