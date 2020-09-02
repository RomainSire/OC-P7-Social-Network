const mysql = require('mysql');

exports.connect = () => {
  const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_BASENAME,
    charset: 'utf8_general_ci'
  });

  connection.connect();
  
  return connection;
}