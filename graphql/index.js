var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');



var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: process.env.DB_ENV_POSTGRES_USER, //env var: PGUSER
  database: 'postgres', //env var: PGDATABASE
  password: process.env.DB_ENV_POSTGRES_PASSWORD, //env var: PGPASSWORD
  host: process.env.DB_PORT_5432_TCP_ADDR, // Server hosting the postgres database
  port: process.env.DB_PORT_5432_TCP_PORT, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})



// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return new Promise(function (resolve, reject) {
      pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * from groups;', [], function(err, result) {
          //call `done()` to release the client back to the pool
          done();

          if(err) {
            return console.error('error running query', err);
            reject(err);
          }
          console.log(result.rows[0].title);
          resolve(result.rows[0].title)
          //output: 1
        });
      });
    });
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8889, '0.0.0.0');
console.log('Running a GraphQL API server at localhost:8889/');
