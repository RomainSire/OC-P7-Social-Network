const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middlewares/validate-inputs');


router.post('/new', validate.newUser, userCtrl.newuser);
router.post('/login', validate.login, userCtrl.login);
router.get('/', userCtrl.getAllUsers);

module.exports = router;