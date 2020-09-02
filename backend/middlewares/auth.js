require('dotenv').config();
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
const cryptojs = require('crypto-js');

module.exports = (req, res, next) => {
  try {
    const cryptedCookie = new Cookies(req, res).get('snToken');
    const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));

    const token = jwt.verify(cookie.token, process.env.JWT_KEY);

    if (cookie.userId && cookie.userId !== token.userId) {
      console.log("User ID non valable");
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée' });
  }
}