const Pool = require("pg").Pool;

let pool = new Pool({
    user: 'postgres',
    password: 'ferrets',
    host: 'localhost',
    port: 5432,
    database: 'bookshelf'
});

if(process.env.PG_CONN_STRING) {
    pool = new Pool({
        connectionString: process.env.PG_CONN_STRING
    })
}

module.exports = {
    query: (text, params) => pool.query(text, params)
  };

