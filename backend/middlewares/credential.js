require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');

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