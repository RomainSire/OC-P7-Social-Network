require('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
const database = require('../utils/database');


exports.getNotifs = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;

  const sql = "SELECT Notifications.id, Notifications.post_id AS postId, Users.name AS initiator, Notification_types.name AS type\
              FROM `Notifications`\
              INNER JOIN Users\
                  ON Notifications.initiator_id = Users.id\
              INNER JOIN Notification_types\
                ON Notifications.type_id = Notification_types.id\
              WHERE user_id = ?";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, notifications, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      res.status(200).json({ notifications });
    }
  });
  connection.end();
}