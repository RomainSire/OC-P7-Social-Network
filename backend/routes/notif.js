const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate-inputs');
const notifCtrl = require('../controllers/notif');
const credential = require('../middlewares/credential');

router.get('/', auth, notifCtrl.getNotifs);
router.delete('/', auth, notifCtrl.deleteAllNotifs);
router.delete('/:id', auth, validate.id, credential.deleteNotification, notifCtrl.deleteOneNotif);

module.exports = router;