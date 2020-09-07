const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');
const validate = require('../middlewares/validate-inputs');


router.post('/', auth, validate.comment, commentCtrl.newComment);

module.exports = router;