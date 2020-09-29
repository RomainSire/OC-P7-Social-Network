const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post');
const validate = require('../middlewares/validate-inputs');
const multer = require('../middlewares/multer-config');
const credential = require("../middlewares/credential");

router.post('/', auth, multer, validate.postContent, postCtrl.newPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, validate.id, postCtrl.getOnePost);
router.get('/:limit/:offset', auth, validate.getSomePosts, postCtrl.getSomePosts);
router.delete('/:id', auth, validate.id, credential.deletePost, postCtrl.deletePost);

module.exports = router;