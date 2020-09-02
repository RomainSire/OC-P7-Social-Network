require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const database = require('../utils/database');


/**
 * Ajout d'un nouvel utilisateur
 */
exports.newuser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const connection = database.connect();

      // Cryptage et échappement SQL des données utilisateurs
      const name = connection.escape(req.body.name);
      const email = connection.escape(req.body.email);
      const password = connection.escape(cryptojs.AES.encrypt(hash, process.env.CRYPT_USER_INFO).toString());

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


/**
 * Login d'un utilisateur
 */
exports.login = (req, res, next) => {
  const connection = database.connect();

  const researchedEmail = connection.escape(req.body.email);
  const sql = "SELECT id, email, password FROM Users WHERE email=" + researchedEmail;

  connection.query(sql, (error, results, fields) => {
    // SI : erreur SQL
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    
    // SI : Utilisateur non trouvé
    } else if (results.length == 0) {
      res.status(401).json({ error: 'Cet utilisateur n\'existe pas' });

    // SI : Utilisateur trouvé
    } else {
      const matchingHash = cryptojs.AES.decrypt(results[0].password, process.env.CRYPT_USER_INFO).toString(cryptojs.enc.Utf8);

      bcrypt.compare(req.body.password, matchingHash)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect!' });
          }

          const newToken = jwt.sign(
            { userId: results[0].id },
            process.env.JWT_KEY,
            { expiresIn: '24h' }
          );
          
          // Envoi du token & userId dans un cookie
          const cookieContent = {
            token: newToken,
            userId: results[0].id
          };
          const cryptedCookie = cryptojs.AES.encrypt(JSON.stringify(cookieContent), process.env.COOKIE_KEY).toString();
          new Cookies(req, res).set('snToken', cryptedCookie, {
            httpOnly: true,
            maxAge: 3600000
          })

          res.status(200).json({ message: 'Utilisateur loggé' });
        })
        .catch(error => res.status(500).json({ error })); 
    }
  });
  connection.end();
}


/**
 * Récupération de tous les utilisateurs
 */
exports.getAllUsers = (req, res, next) => {
  const connection = database.connect();
  const sql = "SELECT id, name, pictureurl FROM Users;";
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ results });
    }
  });
  connection.end();
}