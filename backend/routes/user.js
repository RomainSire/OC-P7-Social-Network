const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');


router.post('/new', userCtrl.newuser);

module.exports = router;