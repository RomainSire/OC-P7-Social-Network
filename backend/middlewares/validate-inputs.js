const Joi = require('joi');

/**
 * Validation des données utilisateur
 */


// Lors de la création d'un nouvel utilisateur
const newUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required()
});
exports.newUser = (req, res, next) => {
  const {error, value} = newUserSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Données saisies invalides" });
  } else {
    next();
  }
};

// lors du login utilisateur
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required()
});
exports.login = (req, res, next) => {
  const {error, value} = loginSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "email ou mot de passe invalide" });
  } else {
    next();
  }
};

// Vérification d'un id
const idSchema = Joi.number().integer().positive().required();
exports.id = (req, res, next) => {
  const {error, value} = idSchema.validate(req.params.id);
  if (error) {
      res.status(422).json({ error: "id invalide" });
  } else {
      next();
  } 
}

// Vérification de la description d'un utilisateur
const outlineSchema = Joi.string().trim().required();
exports.outline = (req, res, next) => {
  const {error, value} = outlineSchema.validate(req.body.outline);
  if (error) {
      res.status(422).json({ error: "Description invalide" });
  } else {
      next();
  }
}

// Lors de l'attribution/retrait du droit utilisateur
const adminCredentialSchema = Joi.valid(0, 1).required();
exports.adminCredential = (req, res, next) => {
  const {error, value} = adminCredentialSchema.validate(req.body.isadmin);
  if (error) {
      res.status(422).json({ error: "Données saisies invalides" });
  } else {
      next();
  }
}