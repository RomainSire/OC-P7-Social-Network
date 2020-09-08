require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');

/**
 * Rate une publication
 */
exports.rate = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = connection.escape(JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId);
  const postId = connection.escape(req.body.postId);
  const rate = connection.escape(req.body.rate);

  // 1ère requête: suppression des précédentes notations de l'utilisateur pour la publication
  const sql = "DELETE FROM Likes\
    WHERE (user_id=" + userId + " AND post_id=" + postId + ");";

  connection.query(sql, (error, results, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      // 2ème requête : ajout du like/dislike
      const secondsql = "INSERT INTO Likes (rate, user_id, post_id)\
      VALUES (" + rate + ", " + userId + ", " + postId + ");";

      connection.query(secondsql, (error, results, fields) => {
        if (error) {
          res.status(500).json({ "error": error.sqlMessage });
        } else {
          res.status(201).json({ message: 'Like ou dislike pris en compte' });
        }
      });
      connection.end();
    }
  });
}

/**
 * Récupérer tous les like / dislike d'une publication
 */
exports.getLikesOfPost = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = connection.escape(JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId);
  const postId = connection.escape(req.body.postId);

  const sql = "SELECT\
  (SELECT COUNT(*) FROM Likes WHERE (post_id=" + postId + " AND rate=1)) AS LikesNumber,\
  (SELECT COUNT(*) FROM Likes WHERE (post_id=" + postId + " AND rate=-1)) AS DislikesNumber,\
  (SELECT rate FROM Likes WHERE (post_id=1 AND user_id=" + userId + ")) AS currentUserReaction";

  connection.query(sql, (error, result, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ likes: result[0] });
    }
  });
  connection.end();
}