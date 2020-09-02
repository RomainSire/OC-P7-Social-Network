const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middlewares/validate-inputs');


router.post('/new', validate.newUser, userCtrl.newuser);

module.exports = router;