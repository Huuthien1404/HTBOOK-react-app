const Pool = require("pg").Pool;
const client = new Pool({
  host: "localhost",
  database: "dbQLBH2",
  password: "Nhuquynh89#",
  port: 5432,
  user: "postgres"
});
module.exports = client;