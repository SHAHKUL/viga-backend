require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.postgreSql,
});
module.exports = {
  pool,
};
