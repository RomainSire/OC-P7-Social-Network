const database = require ('./database');

exports.addReaction = (initiatorId, postId) => {
  const connection = database.connect();
  
  const sql = "INSERT INTO Notifications (user_id, initiator_id, post_id, type_id)\
  VALUES ((SELECT user_id FROM Posts WHERE id = ? ), ?, ?, (SELECT id FROM `Notification_types` WHERE name = 'reaction' ));"
  // userId est déduit à partir de postId
  // typeId est récupéré dans la table notification_types
  const sqlParams = [postId, initiatorId, postId];
  return new Promise((resolve, reject) => {
    connection.execute(sql, sqlParams, (error, result, fields) => {
      if (error) {
        reject({ "error": error.sqlMessage });
      } else {
        resolve({ 'message': 'Notification ajoutée' });
      }
    });
    connection.end();
  })
}