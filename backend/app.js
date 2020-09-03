const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
// const session = require('express-session');

const userRoutes = require('./routes/user');

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
app.use('/api/user', userRoutes);

module.exports = app;