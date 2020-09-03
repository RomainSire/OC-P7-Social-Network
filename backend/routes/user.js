const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middlewares/validate-inputs');
const auth = require('../middlewares/auth');
const credential = require('../middlewares/credential');


router.post('/new', validate.newUser, userCtrl.newuser);
router.post('/login', validate.login, userCtrl.login);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/:id', auth, validate.id, userCtrl.getOneUser);
router.put('/:id/password', auth, validate.id, credential.sameUser, userCtrl.changePassword);

module.exports = router;