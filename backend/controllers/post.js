require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');

/**
 * Ajout d'une nouvelle publication
 */
exports.newPost = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = connection.escape(JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId);
  const imageurl = req.file ? connection.escape(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`) : null;
  const content = req.body.content ? connection.escape(req.body.content) : null;

  const sql = "INSERT INTO Posts (user_id, imageurl, content)\
  VALUES (" + userId + ", " + imageurl + ", " + content + ");";

  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Publication ajoutée' });
    }
  });

  connection.end();
}


/**
 * Récupération de tous les posts
 */
exports.getAllPosts = (req, res, next) => {
  const connection = database.connect();

  const sql = "SELECT Posts.id AS postId, Posts.publication_date AS postDate, Posts.imageurl AS postImage, Posts.content as postContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id ";

  connection.query(sql, (error, posts, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(200).json({ posts });
    }
  });

  connection.end();
}


/**
 * Suppression d'un post
 */
exports.deletePost = (req, res, next) => {
  const connection = database.connect();
  const postId = connection.escape(parseInt(req.params.id, 10));
  const sql = "DELETE FROM Posts WHERE id=" + postId + ";";
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Publication supprimée' });
    }
  });
  connection.end();
}