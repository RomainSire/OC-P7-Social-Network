const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate-inputs');
const notifCtrl = require('../controllers/notif');

router.get('/', auth, notifCtrl.getNotifs);

module.exports = router;