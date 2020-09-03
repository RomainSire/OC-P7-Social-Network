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