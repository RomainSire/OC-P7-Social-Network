const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post');
const validate = require('../middlewares/validate-inputs');
const multer = require('../middlewares/multer-config');

router.post('/', auth, multer, validate.postContent, postCtrl.newPost);

module.exports = router;