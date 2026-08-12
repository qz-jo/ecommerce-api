const { Pool } = require("pg");

// Neon supplies the TLS requirements in DATABASE_URL (for example sslmode=require).
// Do not disable certificate verification here with rejectUnauthorized: false.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
