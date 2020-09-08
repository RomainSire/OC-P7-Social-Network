const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const likeCtrl = require('../controllers/like');
const validate = require('../middlewares/validate-inputs');

router.post('/', auth, validate.like, likeCtrl.rate);
router.get('/', auth, validate.postId, likeCtrl.getLikesOfPost);

module.exports = router;