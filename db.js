const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Data_kira123",
  host: "localhost",
  port: 5432,
  database: "backend_endterm",
});

module.exports = pool;
