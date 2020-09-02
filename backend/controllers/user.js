const mysql = require('mysql');
require('dotenv').config();





exports.newuser = (req, res, next) => {
  const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_BASENAME,
    charset: utf8_general_ci
  });

  connection.connect();

  connection.query('SELECT name FROM Post_types', (error, results, fields) => {
    if (error) throw error;
    console.log(results[0].name);
  });
  
  connection.end();

}