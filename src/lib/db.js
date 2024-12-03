const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'studio.cursos.scyt.gar.com.ar',
  port: 1906,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 