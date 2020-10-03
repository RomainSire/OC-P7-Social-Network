const mysql = require('mysql2');


exports.connect = () => {
  const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : '3306',
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_BASENAME,
    charset: 'utf8_general_ci'
  });
  return connection;
}

exports.pool = () => {
  const pool = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_BASENAME,
    charset: 'utf8_general_ci',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  return pool
}