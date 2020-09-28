const database = require ('./database');

/**
 * Ajout d'une notification lors du like/dislike d'un post
 * @param {number} initiatorId Id de l'utilisateur qui fait l'action de like/dislike
 * @param {number} postId Id du post
 */
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

/**
 * Ajout d'une notification lors du commentaire d'un post
 * @param {number} initiatorId Id de l'utilisateur qui commente
 * @param {number} postId Id du post
 */
exports.addComment = (initiatorId, postId) => {
  const connection = database.connect();
  const sql = "INSERT INTO Notifications (user_id, initiator_id, post_id, type_id)\
  VALUES ((SELECT user_id FROM Posts WHERE id = ? ), ?, ?, (SELECT id FROM `Notification_types` WHERE name = 'comment' ));";
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

/**
 * Ajout d'une notification lors d'une réponse à un commentaire
 * @param {number} initiatorId Id de l'utilisateur qui commente
 * @param {number} postId Id du post
 */
exports.addAnswer = (initiatorId, postId) => {

}