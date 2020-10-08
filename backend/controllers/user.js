require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const database = require('../utils/database');
const { getCommentsOfEachPosts, getLikesOfEachPosts } = require('./post');

/**
 * Ajout d'un nouvel utilisateur
 */
exports.newuser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const connection = database.connect();

      // Cryptage et échappement SQL des données utilisateurs
      const name = req.body.name;
      const email = req.body.email;
      const password = cryptojs.AES.encrypt(hash, process.env.CRYPT_USER_INFO).toString();
      let isAdmin;

      // Requete SQL préliminaire. But: s'il n'y a pas encore d'utilisateur, le premier User créé sera administrateur.
      const preliminarySql = "SELECT COUNT(*) AS numberOfUsers FROM Users;";

      connection.query(preliminarySql, (error, result, fields) => {
        if (error) {
          console.log(error);
          connection.end();
          res.status(500).json({ "error": error.sqlMessage });
        } else {
          console.log(result);
          if (result[0].numberOfUsers === 0) {
            isAdmin = 1;
          } else {
            isAdmin = 0;
          }
          
          // Requete SQL principale
          const sql = "\
          INSERT INTO Users (name, email, password, isadmin)\
          VALUES (?, ?, ?, ?);";
          const sqlParams = [name, email, password, isAdmin];
          
          // Envoi de la requete et réponse au frontend en fonction des erreurs SQL
          connection.execute(sql, sqlParams, (error, results, fields) => {
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
        }
      });
    })
    .catch(error => res.status(500).json({ error }));
}

/**
 * Login d'un utilisateur
 */
exports.login = (req, res, next) => {
  const connection = database.connect();

  const researchedEmail = req.body.email;
  const sql = "SELECT id, email, password, name, pictureurl, isadmin FROM Users WHERE email= ?";
  const sqlParams = [researchedEmail];
  // requête préparée de mysql2
  connection.execute(sql, sqlParams, (error, results, fields) => {
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
            maxAge: 3600000  // cookie pendant 1 heure
          })

          res.status(200).json({
            message: 'Utilisateur loggé',
            userId: results[0].id,
            name: results[0].name,
            pictureUrl: results[0].pictureurl,
            isAdmin: results[0].isadmin
          });
        })
        .catch(error => res.status(500).json({ error })); 
    }
  });
  connection.end();
}

/**
 * Logout d'un utilisateur
 */
exports.logout = (req, res, next) => {
  // on remplace le cookie par un vide
  new Cookies(req, res).set('snToken', "", {
    httpOnly: true,
    maxAge: 1  // 1ms (= suppression quasi instantannée)
  })
  res.status(200).json({ message: "utilisateur déconnecté" });
}

/**
 * Réponse à la vérification qu'un utilisateur est bien loggé (arrive après le middleware d'authentification..!)
 */
exports.isAuth = (req, res, next) => {
  res.status(200).json({ message: "utilisateur bien authentifié" });
}

/**
 * Renvoie les infos d'un utilisateur, en fonction de l'Id utilisateur stocké dans le cookie
 */
exports.getCurrentUser = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const searchId = cookie.userId;
  const sql = "SELECT id, name, pictureurl, isadmin FROM Users WHERE id=?";
  const sqlParams = [searchId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    // SI : erreur SQL
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });

    // SI : Utilisateur non trouvé
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Cet utilisateur n\'existe pas' });

    // SI : Utilisateur trouvé
    } else {
      res.status(200).json({
        userId: results[0].id,
        name: results[0].name,
        pictureUrl: results[0].pictureurl,
        isAdmin: results[0].isadmin
      });
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
  connection.query(sql, (error, users, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(200).json({ users });
    }
  });
  connection.end();
}

/**
 * Récupération d'1 seul utilisateur
 */
exports.getOneUser = (req, res, next) => {
  const connection = database.connect();
  const searchId = req.params.id;
  const sql = "SELECT id, name, email, pictureurl, outline, isadmin FROM Users WHERE id=?";
  const sqlParams = [searchId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    // SI : erreur SQL
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });

    // SI : Utilisateur non trouvé
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Cet utilisateur n\'existe pas' });

    // SI : Utilisateur trouvé
    } else {
      res.status(200).json({
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        pictureurl: results[0].pictureurl,
        outline: results[0].outline,
        isadmin: results[0].isadmin
      });
    }
  });
  connection.end();
}

/**
 * Recherche d'utilisateurs
 */
exports.searchUsers = (req, res, next) => {
  const connection = database.connect();
  const searchTerm = "%" + req.query.name + "%";
  const sql = "SELECT id, name, pictureurl FROM Users WHERE name LIKE ?;";
  const sqlParams = [searchTerm];
  connection.execute(sql, sqlParams, (error, users, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(200).json({ users });
    }
  });
  connection.end();
}

/**
 * Changer le mot de passe utilisateur
 */
exports.changePassword = (req, res, next) => {
  // Vérification que l'ancien mot de passe soit correct
  const connection = database.connect();
  const searchId = req.params.id;
  const sql = "SELECT password FROM Users WHERE id=?";
  const sqlParams = [searchId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
      connection.end();
    } else {
      const DBPasswordHash = cryptojs.AES.decrypt(results[0].password, process.env.CRYPT_USER_INFO).toString(cryptojs.enc.Utf8);
      bcrypt.compare(req.body.oldPassword, DBPasswordHash)
        .then(valid => {
          if (!valid) {
            connection.end();
            return res.status(401).json({ error: 'Ancien mot de passe incorrect!' });
          }
          // L'ancien mot de passe est correct, donc mise à jour du mot de passe :
          bcrypt.hash(req.body.newPassword, 10)
            .then(hash => {
              const newPassword = cryptojs.AES.encrypt(hash, process.env.CRYPT_USER_INFO).toString();
              const sql2 = "UPDATE Users SET password=? WHERE id=?";
              const sqlParams2 = [newPassword, searchId];
              connection.execute(sql2, sqlParams2, (error, results, fields) => {
                if (error) {
                  connection.end();
                  res.status(500).json({ "error": error.sqlMessage });
                } else {
                  connection.end();
                  res.status(201).json({ message: 'Mot de passe modifié' });
                }
              })
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
  });
}

/**
 * Changer la photo de profil d'un utilisateur
 */
exports.changeProfilePicture = (req, res, next) => {
  const connection = database.connect();
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  const userId = req.params.id;
  const sql = "UPDATE Users SET pictureurl=? WHERE id=?";
  const sqlParams = [imageUrl, userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Photo de profil modifiée' });
    }
  });
  connection.end();
}

/**
 * Changer la description ("outline"..) de l'utilisateur
 */
exports.changeOutline = (req, res, next) => {
  const connection = database.connect();
  const outline = req.body.outline;
  const userId = req.params.id;
  const sql = "UPDATE Users SET outline=? WHERE id=?";
  const sqlParams = [outline, userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Description du profil modifiée' });
    }
  });
  connection.end();
}

/**
 * Donner/enlever les droits d'admin à un utilisateur
 */
exports.changeAdmin = (req, res, next) => {
  const connection = database.connect();
  const isadmin = req.body.isadmin;
  const userId = req.params.id;
  const sql = "UPDATE Users SET isadmin=? WHERE id=?";
  const sqlParams = [isadmin, userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(201).json({ message: 'Droits d\'administrateur modifiée' });
    }
  });
  connection.end();
}

/**
 * Supprimer son compte utilisateur
 */
exports.deleteAccount = (req, res, next) => {
  const connection = database.connect();
  const userId = req.params.id;
  const sql = "DELETE FROM Users WHERE id=?";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      // utilisateur supprimé dans la BDD, il faut ensuite supprimer le cookie permettant d'identifier les requêtes.
      // pour cela : on écrase le cookie existant avec un cookie vide, et qui a en plus une durée de vie de 1 seconde..
      new Cookies(req, res).set('snToken', false, {
        httpOnly: true,
        maxAge: 1000
      });
      res.status(201).json({ message: 'Utilisateur supprimé' });
    }
  });
  connection.end();
}


/**
 * Récupérer toutes les publications d’un utilisateur en particulier
 */
exports.getAllPostsOfUser = (req, res, next) => {
  const connection = database.connect();
  // 1: récupération de tous les posts
  const userId = req.params.id;
  const sql = "SELECT Posts.id AS postId, Posts.publication_date AS postDate, Posts.imageurl AS postImage, Posts.content as postContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  WHERE Posts.user_id = ?\
  ORDER BY postDate DESC;";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      // 2: Pour chaque post, on va chercher tous les commentaires du post
      getCommentsOfEachPosts(rawPosts, connection)
        .then(postsWithoutLikes => {
          // 3: Pour chaque post, on rajoute les likes/dislikes
          const cryptedCookie = new Cookies(req, res).get('snToken');
          const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
          getLikesOfEachPosts(postsWithoutLikes, userId, connection)
            .then(posts => {
              res.status(200).json({ posts });
            })
            .catch(err => {
              res.status(500).json({ "error": "Un problème est survenu" });
            })
        })
        .catch(err => {
          res.status(500).json({ "error": "Un problème est survenu" });
        })
    }
  })
}