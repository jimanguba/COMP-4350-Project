const Pool = require("pg").Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'ferrets',
    host: 'localhost',
    port: 5432,
    database: 'bookshelf'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
  };

