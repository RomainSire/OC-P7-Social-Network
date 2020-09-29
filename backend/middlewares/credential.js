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
  const userId = cookie.userId;
  const sql = "SELECT isadmin FROM Users WHERE id=?";
  const sqlParams = [userId]
  connection.execute(sql, sqlParams, (error, results, fields) => {
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
}

/**
 * Vérifier les autorisations pour la suppression d'un post
 * Droits d'admin OU (id utilisateur = id de l'auteur du post)
 */
exports.deletePost = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = cookie.userId;
  const sql = "SELECT isadmin FROM Users WHERE id=?";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        // l'utilisateur est administrateur
        next();
      } else {
        // l'utilisateur n'est pas admin, vérification si c'est l'auteur du post
        const postId = req.params.id;
        const sql2 = "SELECT user_id FROM Posts WHERE id=?";
        const sqlParams2 = [postId];
        connection.execute(sql2, sqlParams2, (error, results, fields) => {
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

/**
 * Vérifier les autorisations pour la suppression d'un commentaire
 * Droits d'admin OU (id utilisateur = id de l'auteur du post)
 */
exports.deleteComment = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = cookie.userId;
  const sql = "SELECT isadmin FROM Users WHERE id=?";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        // l'utilisateur est administrateur
        connection.end();
        next();
      } else {
        // l'utilisateur n'est pas admin, vérification si c'est l'auteur du commentaire
        const commentId = req.params.id;
        const sql2 = "SELECT user_id FROM Comments WHERE id=?";
        const sqlParams2 = [commentId];
        connection.execute(sql2, sqlParams2, (error, results, fields) => {
          if (error) {
            res.status(500).json({ "error": error.sqlMessage });
          } else if (results.length === 0) {
            res.status(422).json({ "error": "Ce commentaire n'existe pas" });
          } else {
            const commentAuthorId = results[0].user_id;
            if (commentAuthorId === parseInt(userId, 10)) {
              // l'utilisateur est bien l'auteur du commentaire
              next();
            } else {
              // l'utilisateur est ni admin, ni l'auteur du commentaire
              res.status(403).json({ error: 'Accès refusé' });
            }
          }
        });
        connection.end();
      }
    }
  });
}


/**
 * Vérifier les autorisations pour la suppression d'une notification
 * id utilisateur = userId de la notification
 */
exports.deleteNotification = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const notificationId = req.params.id;

  const sql = "SELECT user_id FROM Notifications WHERE id = ?";
  const sqlParams = [notificationId]

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else if (results.length === 0) {
      res.status(422).json({ "error": "Cette notification n'existe pas" });
    } else {
      const notificationUserId = results[0].user_id;
      if (notificationUserId === parseInt(userId, 10)) {
        // l'utilisateur est bien le "destinataire" de la notification
        next();
      } else {
        res.status(403).json({ error: 'Accès refusé' });
      }
    }
  })
}