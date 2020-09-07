require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');
const { post } = require('../app');

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

/**
 * Récupérer tous les commentaires d'un post particulier
 */
exports.getCommentsofPost = (req, res, next) => {
  const connection = database.connect();

  const postId = connection.escape(req.body.postId);

  const sql = "SELECT Comments.id AS commentId, Comments.publication_date AS commentDate, Comments.content As commentContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
  FROM Comments\
  INNER JOIN Users ON Comments.user_id = Users.id\
  WHERE Comments.post_id = " + postId;

  connection.query(sql, (error, comments, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ comments });
    }
  });

  connection.end();
}

/**
 * Suppression d'un commentaire
 */
exports.deleteComment = (req, res, next) => {
  const connection = database.connect();
  const commentId = connection.escape(parseInt(req.params.id, 10));
  const sql = "DELETE FROM Posts WHERE id=" + commentId + ";";
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Commentaire supprimée' });
    }
  });
  connection.end();
}