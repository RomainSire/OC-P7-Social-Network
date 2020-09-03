const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middlewares/validate-inputs');
const auth = require('../middlewares/auth');
const credential = require('../middlewares/credential');
const multer = require('../middlewares/multer-config');


router.post('/new', validate.newUser, userCtrl.newuser);
router.post('/login', validate.login, userCtrl.login);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/:id', auth, validate.id, userCtrl.getOneUser);
router.put('/:id/password', auth, validate.id, credential.sameUser, userCtrl.changePassword);
router.put('/:id/picture', auth, validate.id, credential.sameUser, multer, userCtrl.changeProfilePicture);
router.put('/:id/outline', auth, validate.id, credential.sameUser, userCtrl.changeOutline);

module.exports = router;