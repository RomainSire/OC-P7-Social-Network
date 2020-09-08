# Organisation de la base de données MySQL

-------------------------------------------------------------------------------------------------
## Users
Liste des utilisateurs  

| Field         | Type           | Null | Key                        | Autre                     |
| ------------- | -------------- | ---- | -------------------------- | ------------------------- |
| id            | SMALLINT       | NO   | PRIMARY                    | auto_increment ; unsigned |
| name          | VARCHAR(255)   | NO   | -                          | -                         |
| email         | VARCHAR(255)   | NO   | UNIQUE                     |                           |
| password      | VARCHAR(255)   | NO   | -                          | -                         |
| pictureurl    | VARCHAR(255)   | YES  | -                          | -                         |
| outline       | VARCHAR(255)   | YES  | -                          | -                         |
| isadmin       | TINYINT        | NO   | -                          | -                         |


> id : SMALLINT unsigned = 65 534 utilisateurs possible.  
> email : unique = 2 email identiques interdits  
> la photo de profil (pictureurl) et la courte description (outline) ne sont pas obligatoires.


-------------------------------------------------------------------------------------------------
## Posts
Liste des publications  

| Field            | Type           | Null | Key                         | Autre                     |
| ---------------- | -------------- | ---- | --------------------------- | ------------------------- |
| id               | MEDIUMINT      | NO   | PRIMARY                     | auto_increment ; unsigned |
| publication_date | DATETIME       | NO   | -                           | -                         |
| user_id          | SMALLINT       | YES  | FOREIGN (Ref:Users.id)      | unsigned                  |
| imageurl         | VARCHAR(255)   | YES  | -                           | -                         |
| content          | TEXT           | YES  | -                           | -                         |



> id : MEDIUMINT unsigned = 16 777 214 posts possibles.  
> user_id : clé étrangère faisant référence à l'utilisateur qui a posté  
> imageurl : contiendra l'url de l'image  
> content : contiendra le texte de la publication


-------------------------------------------------------------------------------------------------
## Comments
Liste des commentaires des publications

| Field            | Type           | Null | Key                        | Autre                     |
| ---------------- | -------------- | ---- | -------------------------- | ------------------------- |
| id               | INT            | NO   | PRIMARY                    | auto_increment ; unsigned |
| publication_date | DATETIME       | NO   | -                          | -                         |
| content          | TEXT           | NO   | -                          | -                         |
| user_id          | SMALLINT       | YES  | FOREIGN (Ref:Users.id)     | unsigned                  |
| post_id          | MEDIUMINT      | NO   | FOREIGN (Ref:Posts.id)     | unsigned                  |


> Possibilité de nombreux commentaires pour chaque post, donc INT choisi pour l'id  
> user_id : clé étrangère faisant référence à l'utilisateur qui a écrit le commentaire  
> post_id : clé étrangère faisant référence au post auquel se rattache le commentaire


-------------------------------------------------------------------------------------------------
## Likes
Liste des likes / dislikes des publications

| Field         | Type           | Null | Key                        | Autre                     |
| ------------- | -------------- | ---- | -------------------------- | ------------------------- |
| id            | INT            | NO   | PRIMARY                    | auto_increment ; unsigned |
| rate          | TINYINT        | NO   | -                          | -                         |
| user_id       | SMALLINT       | NO   | FOREIGN (Ref:Users.id)     | unsigned                  |
| post_id       | MEDIUMINT      | NO   | FOREIGN (Ref:Posts.id)     | unsigned                  |

> rate : sera = 1 si like, et = -1 si dislike  
> user_id : clé étrangère faisant référence à l'utilisateur qui a like/dislike  
> post_id : clé étrangère faisant référence au post auquel se rattache le like/dislike


-------------------------------------------------------------------------------------------------
## Notifications
Liste des notifications.  
Il y aura une notification si :
  - qqn like/dislique un post du user
  - qqn commente un post du user
  - qqn a répondu à un commentaires du user

| Field         | Type           | Null | Key                              | Autre                     |
| ------------- | -------------- | ---- | -------------------------------- | ------------------------- |
| id            | INT            | NO   | PRIMARY                          | auto_increment ; unsigned |
| user_id       | SMALLINT       | NO   | FOREIGN (Ref:Users.id)           | unsigned                  |
| initiator_id  | SMALLINT       | YES  | FOREIGN (Ref:Users.id)           | unsigned                  |
| post_id       | MEDIUMINT      | NO   | FOREIGN (Ref:Posts.id)           | unsigned                  |
| type_id       | TINYINT        | NO   | FOREIGN (Ref:Notification_types) | unsigned                  |

> user_id :      id de l'utilisateur qui recevra la notification  
> initiator_id : id de l'utilisateur qui a provoqué la notification (qui a réagi à un post ou un commentaire de l'utilisateur)  
> post_id :      id du post qui a initié l'interraction entre les 2 utilisateurs  
> type_id :      fait référence au type de notification (qqn a like/dislike, ou commenté un post, ou répondu à un commentaire)


-------------------------------------------------------------------------------------------------
## Notification_types
Liste des types de notifications possibles

| Field         | Type           | Null | Key                        | Autre                     |
| ------------- | -------------- | ---- | -------------------------- | ------------------------- |
| id            | TINYINT        | NO   | PRIMARY                    | auto_increment ; unsigned |
| name          | VARCHAR(10)    | NO   | -                          | -                         |


> Pour l'instant la table ne contiendra que 3 lignes:  
> 1 : 'reaction' (pour like/dislike)  
> 2 : 'comment'  (pour un commentaire de publication)  
> 3 : 'answer'   (pour une réponse à un commentaire)