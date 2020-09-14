const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

// DEVELOPEMENT : Pour le log !
const Cookies = require('cookies');
const cryptojs = require('crypto-js');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');

// Lancement de Express
const app = express();

/**
 * MIDDLEWARES
 */
// Configuration cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
// Parse le body des requetes en json
app.use(bodyParser.json());
// Log toutes les requêtes passées au serveur
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan(':method :url :status [:date[clf]] (REQ: :req[content-length]) (RES: :res[content-length])', { stream: accessLogStream }));

// DEVELOPEMENT : log de la requete en console
app.use((req, res, next) => {
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = cryptedCookie ? JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)) : undefined;
  const toBeDisplayed = {
    date: new Date().toString(),
    method: req.method,
    url: req.url,
    body: req.body,
    cookie: cookie
  }
  console.log(toBeDisplayed);
  next();
})


/**
 * ROUTES
 */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);

module.exports = app;