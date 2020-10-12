require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const database = require('../utils/database');
const { getCommentsOfEachPosts, getLikesOfEachPosts } = require('./post');

const { sequelize, User } = require('../models/user');
const { Op } = require('sequelize')

/**
 * Ajout d'un nouvel utilisateur
 */
exports.newuser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await sequelize.sync();
    const amount = await User.count();
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: cryptojs.AES.encrypt(hash, process.env.CRYPT_USER_INFO).toString(),
      isAdmin: amount === 0 ? 1 : 0
    })
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Login d'un utilisateur
 */
exports.login = async (req, res, next) => {
  try {
    await sequelize.sync();
    const matchingUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (matchingUser === null) {
      res.status(401).json({ error: 'Cet utilisateur n\'existe pas' });
    }
    const matchingHash = cryptojs.AES.decrypt(matchingUser.password, process.env.CRYPT_USER_INFO).toString(cryptojs.enc.Utf8);
    const valid = await bcrypt.compare(req.body.password, matchingHash)
    if (!valid) {
      return res.status(401).json({ error: 'Mot de passe incorrect!' });
    }
    const newToken = jwt.sign(
      { userId: matchingUser.id },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    
    // Envoi du token & userId dans un cookie
    const cookieContent = {
      token: newToken,
      userId: matchingUser.id
    };
    const cryptedCookie = cryptojs.AES.encrypt(JSON.stringify(cookieContent), process.env.COOKIE_KEY).toString();
    new Cookies(req, res).set('snToken', cryptedCookie, {
      httpOnly: true,
      maxAge: 3600000  // cookie pendant 1 heure
    })

    res.status(200).json({
      message: 'Utilisateur loggé',
      userId: matchingUser.id,
      name: matchingUser.name,
      pictureUrl: matchingUser.pictureurl,
      isAdmin: matchingUser.isAdmin
    });
  } catch (error) {
    res.status(500).json({ error });
  }
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
exports.getCurrentUser = async (req, res, next) => {
  try {
    const cryptedCookie = new Cookies(req, res).get('snToken');
    const searchId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
    await sequelize.sync();
    const matchingUser = await User.findOne({
      where: {
        id: searchId
      }
    });
    if (matchingUser === null) {
      res.status(401).json({ error: 'Cet utilisateur n\'existe pas' });
    } else {
      res.status(200).json({
        userId: matchingUser.id,
        name: matchingUser.name,
        pictureUrl: matchingUser.pictureurl,
        isAdmin: matchingUser.isAdmin
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Récupération de tous les utilisateurs
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    await sequelize.sync();
    const users = await User.findAll({
      attributes: ['id', 'name', 'pictureurl']
    })
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Récupération d'1 seul utilisateur
 */
exports.getOneUser = async (req, res, next) => {
  try {
    await sequelize.sync();
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (user === null) {
      res.status(401).json({ error: 'Cet utilisateur n\'existe pas' });
    } else {
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        pictureurl: user.pictureurl,
        outline: user.outline,
        isadmin: user.isAdmin
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Recherche d'utilisateurs
 */
exports.searchUsers = async (req, res, next) => {
  try {
    await sequelize.sync();
    const users = await User.findAll({
      attributes: ['id', 'name', 'pictureurl'],
      where: {
        name: {
          [Op.like]: '%' + req.query.name + '%'
        }
      }
    })
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Changer le mot de passe utilisateur
 */
exports.changePassword = async (req, res, next) => {
  try {
    await sequelize.sync();
    // Vérification que l'ancien mot de passe soit correct
    const user = await User.findOne({
      attributes: ['password'],
      where: {
        id: req.params.id
      }
    })
    const DBPasswordHash = cryptojs.AES.decrypt(user.password, process.env.CRYPT_USER_INFO).toString(cryptojs.enc.Utf8);
    const valid = await bcrypt.compare(req.body.oldPassword, DBPasswordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Ancien mot de passe incorrect!' });
    }
    // L'ancien mot de passe est correct, donc mise à jour du mot de passe :
    const hash = await bcrypt.hash(req.body.newPassword, 10)
    const newPassword = cryptojs.AES.encrypt(hash, process.env.CRYPT_USER_INFO).toString();
    await User.update({ password: newPassword }, {
      where: {
        id: req.params.id
      }
    });
    res.status(201).json({ message: 'Mot de passe modifié' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Changer la photo de profil d'un utilisateur
 */
exports.changeProfilePicture = async (req, res, next) => {
  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    await sequelize.sync();
    await User.update({ pictureurl: imageUrl }, {
      where: {
        id: req.params.id
      }
    });
    res.status(201).json({ message: 'Photo de profil modifiée' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Changer la description ("outline"..) de l'utilisateur
 */
exports.changeOutline = async (req, res, next) => {
  try {
    await sequelize.sync();
    await User.update({ outline: req.body.outline }, {
      where: {
        id: req.params.id
      }
    });
    res.status(201).json({ message: 'Description du profil modifiée' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Donner/enlever les droits d'admin à un utilisateur
 */
exports.changeAdmin = async (req, res, next) => {
  try {
    await sequelize.sync();
    await User.update({ isAdmin: req.body.isadmin }, {
      where: {
        id: req.params.id
      }
    });
    res.status(201).json({ message: 'Droits d\'administrateur modifiée' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Supprimer son compte utilisateur
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    await sequelize.sync();
    await User.destroy({
      where: {
        id: req.params.id
      }
    });
    // suppression cookie (= new cookie vide de 1 seconde)
    new Cookies(req, res).set('snToken', false, {
      httpOnly: true,
      maxAge: 1000
    });
    res.status(201).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ error });
  }
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