const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middlewares/validate-inputs');
const auth = require('../middlewares/auth');


router.post('/new', validate.newUser, userCtrl.newuser);
router.post('/login', validate.login, userCtrl.login);
router.get('/', auth, userCtrl.getAllUsers);

module.exports = router;