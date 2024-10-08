const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: "",
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

async function testConnection() {
  try {
    const result = await query("SELECT 1");
    console.log("Database connection successful");
    console.log("Test query result:", result);
    return true;
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
    return false;
  }
}

module.exports = {
  query,
  testConnection,
};
