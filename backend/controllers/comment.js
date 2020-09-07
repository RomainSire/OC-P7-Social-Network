require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');

/**
 * Ajout d'une nouvelle publication
 */
exports.newComment = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = connection.escape(JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId);
  const postId = connection.escape(req.body.postId);
  const content = connection.escape(req.body.content);

  const sql = "INSERT INTO Comments (user_id, post_id, content)\
  VALUES (" + userId + ", " + postId + ", " + content + ");";

  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Commentaire ajoutée' });
    }
  });

  connection.end();
}