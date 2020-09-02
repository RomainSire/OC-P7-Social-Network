require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');

const database = require('../utils/database');



exports.newuser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const connection = database.connect();

      // Cryptage et échappement SQL des données utilisateurs
      const name = connection.escape(cryptojs.HmacSHA256(req.body.name, process.env.CRYPT_USER_INFO).toString());
      const email = connection.escape(cryptojs.HmacSHA256(req.body.email, process.env.CRYPT_USER_INFO).toString());
      const password = connection.escape(cryptojs.HmacSHA256(hash, process.env.CRYPT_USER_INFO).toString());

      // Requete SQL
      const sql = "\
      INSERT INTO Users (name, email, password, isadmin)\
      VALUES (" + name + ", " + email + ", " + password + ", 0);";
      
      // Envoi de la requete et réponse au frontend en fonction des erreurs SQL
      connection.query(sql, (error, results, fields) => {
        if (error) {
          if (error.errno === 1062) { // ERREUR : email déjà utilisé dans la base
            res.status(403).json({ "error": "L'email est déjà utilisé !" });
          } else { // Autre erreur SQL
            res.status(500).json({ "error": error.sqlMessage });
          }
        } else { // Pas d'erreur : utilisateur ajouté
          res.status(201).json({ message: 'Utilisateur créé' });
        }
      });
      connection.end();
    })
    .catch(error => res.status(500).json({ error }));
}