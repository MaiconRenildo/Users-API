var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : '1233214m',
      database : 'apiusers'
    }
  });

module.exports = knex