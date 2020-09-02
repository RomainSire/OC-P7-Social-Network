require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');

const database = require('../utils/database');



exports.newuser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const name = cryptojs.HmacSHA256(req.body.name, process.env.CRYPT_USER_INFO).toString();
      const email = cryptojs.HmacSHA256(req.body.email, process.env.CRYPT_USER_INFO).toString();
      const password = cryptojs.HmacSHA256(hash, process.env.CRYPT_USER_INFO).toString();

      const sql = "INSERT INTO Users (name, email, password, isadmin)\
      VALUES ('" + name + "', '" + email + "', '" + password + "', 0);";

      const connexion = database.connexion();
      connexion.query(sql, (error, results, fields) => {
        if (error) {
          if (error.errno === 1062) {
            // ERREUR : email déjà utilisé dans la base
            res.status(403).json({ "error": "L'email est déjà utilisé !" });
          } else {
            // Autre erreur
            res.status(500).json({ "error": error.sqlMessage });
          }
        } else {
          // Pas d'erreur : utilisateur ajouté
          res.status(201).json({
            message: 'Utilisateur créé',
            userId: results.insertId
          });
        }
      });
      connexion.end();
    })
    .catch(error => res.status(500).json({ error }));
}