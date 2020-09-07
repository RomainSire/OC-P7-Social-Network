require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');


/**
 * Vérifie que l'id utilisateur en paramètre et le même que l'id stocké dans le cookie
 * = seul l'utilisateur, lui-même, peut modifier sa page profil
 */
exports.sameUser = (req, res, next) => {
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  if (req.params.id == cookie.userId) {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé' });
  }
}

/**
 * Vérifie que l'utilisateur a bien les droits administrateur
 */
exports.isAdmin = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = connection.escape(cookie.userId);
  const sql = "SELECT isadmin FROM Users WHERE id=" + userId;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        next();
      } else {
        res.status(403).json({ error: 'Accès refusé' });
      }
    }
  });
  connection.end();
}

/**
 * Vérifier les autorisations pour la suppression d'un post
 * Droits d'admin OU (id utilisateur = id de l'auteur du post)
 */
exports.deletePost = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = connection.escape(cookie.userId);
  const sql = "SELECT isadmin FROM Users WHERE id=" + userId;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        // l'utilisateur est administrateur
        connection.end();
        next();
      } else {
        // l'utilisateur n'est pas admin, vérification si c'est l'auteur du post
        const postId = connection.escape(req.params.id);
        const secondSql = "SELECT user_id FROM Posts WHERE id=" + postId;
        connection.query(secondSql, (error, results, fields) => {
          if (error) {
            res.status(500).json({ "error": error.sqlMessage });
          } else if (results.length === 0) {
            res.status(422).json({ "error": "Cette publication n'existe pas" });
          } else {
            const postAuthorId = results[0].user_id;
            if (postAuthorId === parseInt(userId, 10)) {
              // l'utilisateur est bien l'auteur du post
              next();
            } else {
              // l'utilisateur est ni admin, ni l'auteur du post
              res.status(403).json({ error: 'Accès refusé' });
            }
          }
        });
        connection.end();
      }
    }
  });
}