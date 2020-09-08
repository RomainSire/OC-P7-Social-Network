const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const likeCtrl = require('../controllers/like');
const validate = require('../middlewares/validate-inputs');

router.post('/', auth, validate.like, likeCtrl.rate);

module.exports = router;