const Pool = require("pg").Pool;
require("dotenv").config();
const client = new Pool({
  host: process.env.HOSTNAME,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
  user: process.env.USER,
  ssl: true
});
module.exports = client;