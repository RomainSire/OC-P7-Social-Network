const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

// Lancement de Express
const app = express();

/**
 * MIDDLEWARES
 */
// Configuration cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// Parse le body des requetes en json
app.use(bodyParser.json());

/**
 * ROUTES
 */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;