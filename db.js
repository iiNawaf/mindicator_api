const Pool = require("pg").Pool;
require('dotenv').config();

const pool = new Pool({
    user: "postgres",
    password: process.env.DB_PASSWORD,
    host: "mindicator.c3rgseze9neb.eu-north-1.rds.amazonaws.com",
    port: 5432,
    database: "mindicator"
});

module.exports = pool;

