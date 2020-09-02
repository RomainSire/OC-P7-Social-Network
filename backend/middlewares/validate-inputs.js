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