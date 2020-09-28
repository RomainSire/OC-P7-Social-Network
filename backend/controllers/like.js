require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');
const notification = require('../utils/notifications');

/**
 * Rate une publication
 */
exports.rate = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const postId = req.body.postId;
  const rate = req.body.rate;

  // 1ère requête: suppression des précédentes notations de l'utilisateur pour la publication
  const sql = "DELETE FROM Likes\
    WHERE (user_id=? AND post_id=?);";
  const sqlParams = [userId, postId];

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      // 2ème requête : ajout du like/dislike
      const sql2 = "INSERT INTO Likes (rate, user_id, post_id)\
      VALUES (?, ?, ?);";
      const sqlParams2 = [rate, userId, postId];

      connection.execute(sql2, sqlParams2, (error, results, fields) => {
        if (error) {
          res.status(500).json({ "error": error.sqlMessage });
        } else {
          notification.addReaction(userId, postId) // ajout de la notification (= 3ème requête..)
            .then(data => {
              res.status(201).json({ message: 'Like ou dislike pris en compte' });
            })
            .catch(err => {
              res.status(500).json({ "error": err });
            })
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
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const postId = req.body.postId;

  const sql = "SELECT\
  (SELECT COUNT(*) FROM Likes WHERE (post_id=? AND rate=1)) AS LikesNumber,\
  (SELECT COUNT(*) FROM Likes WHERE (post_id=? AND rate=-1)) AS DislikesNumber,\
  (SELECT rate FROM Likes WHERE (post_id=1 AND user_id=?)) AS currentUserReaction";
  const sqlParams = [postId, postId, userId];

  connection.execute(sql, sqlParams, (error, result, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(200).json({ likes: result[0] });
    }
  });
  connection.end();
}