# OpenClassrooms P7 - Réseau social d'entreprise
7ème projet de la formation de [développeur web de OpenClassrooms](https://openclassrooms.com/fr/paths/185-developpeur-web)

## Scénario
Développement (Frontend et Backend) d'un réseau social d'entreprise pour une société fictive Groupomania.  
Une grande liberté est donnée pour développer ce projet.

## Technologies utilisées
- Backend
  - Serveur **Node.js** avec Framework **Express**
  - Base de Données **MySQL**
  - **API REST**
- Frontend
  - Framework **Angular**
  - **SCSS** (sans framework css)

## Documentation
Le dossier "docs" contient :
- **Cahier des charges.md** : Le cahier des charge du projet ou sont décrites les fonctionnalités, les différentes pages, l'organisation du travail
- **Base de données.md** : L'organisation de la base de données MySQL, avec les différents types de données pour chaque table
- **CreationBDD.sql** : Permet de créer la base de données MySQL initiale (=vide)
- **Guidelines API.ods** : Les guidelines de l'API backend : résumé des routes avec les entrées/sorties

## Installation
### Methode1 (conseillée) : Avec Docker
1. **Cloner le dépot Github**
```bash
git clone https://github.com/RomainSire/OC-P7-Social-Network.git
```
2. **Lancer les différents éléments avec docker-compose**
```bash
cd OC-P7-Social-Network
docker-compose up --build -d
```
3. **Essayer l'application**
- Le réseau social est normalement accessible à l'adresse : localhost:4200
- Pour tester plus en détail le backend (avec postman par exemple), ce dernier devrait répondre à l'adresse : localhost:3000

NB:
- J'ai déjà inclus quelques utilisateurs et publications, pour ne pas arriver sur un réseau social vide..
- Tous les utilisateurs sont utilisable avec le login: "prenom.nom@email.com" et le mot de passe: "motdepasse"
- Le premier utilisateur créé a automatiquement les droits d'admin. Pour tester ce compte, utiliser le login "mr.admin@email.com" et le mot de passe "motdepasse"
- La persistance des données (base de données et images) est fonctionnelle, tant que les volumes sn-mysql-data et sn-images ne sont pas supprimés.

### Methode2 (déconseillée) : Manuellement
1. **Cloner ce dépot Github**
```bash
git clone https://github.com/RomainSire/OC-P7-Social-Network.git
```
2. **Préparer la base de données MySQL**
- Se connecter à MySQL :
```bash
mysql -u root -p # remplacer root par votre nom d'utilisateur, puis saisir le mot de passe
```
- Une fois dans MySQL
```sql
-- 1: Créer une nouvelle base
CREATE DATABASE social_network CHARACTER SET 'utf8'; -- Remplacer "social_network" par le nom souhaité
-- 2: Facultatif, mais vivement conseillé : créer un utilisateur avec tous les droits, mais seulement sur cette nouvelle base
CREATE USER 'socialadmin'@'localhost' IDENTIFIED BY 'mot_de_passe'; -- remplacer "socialadmin" et "mot_de_passe" par le login/mdp souhaité
GRANT ALL PRIVILEGES ON social_network.* TO 'socialadmin'@'localhost';
```
- Se déconnecter, puis se reconnecter avec ce nouvel utilisateur créé, et directement dans la nouvelle base
```bash
mysql -u socialadmin -p social_network
```
- Ajouter les tables à la nouvelle base grace au fichier **CreationBDD.sql**
```sql
SOURCE docs/CreationBDD.sql  -- remplacer par le chemin d'accès correct vers le fichier
```
3. **Backend**
- Ajouter le fichier .env dans le dossier ./backend/, avec les variables :
```
DB_HOST='localhost'
DB_BASENAME='social_network'
DB_USER='socialadmin'
DB_PASSWORD='mot_de_passe'
CRYPT_USER_INFO='mot_de_passe_secret_pour_cryptoJS'
JWT_KEY='un_autre_mot_de_passe_pourJWT'
COOKIE_KEY='encore_un_mdp_pour_le_cookie'
```
- initialisation et démarrage du backend
```bash
cd backend # Aller dans le dossier "backend"
npm install # Installer les dépendances
node server # lancer le backend
```
4. **Frontend**
- Ouvrir un nouveau terminal
- initialisation et démarrage du frontend (Angular doit être installé sur la machine)
```bash
cd frontend # Aller dans le dossier "frontend"
npm install # Installer les dépendances
ng serve # lancer le frontend
```
<<<<<<< HEAD
### 5. Utilisation
=======
5. **Essayer l'application**
>>>>>>> Mise en place de Docker
- Le réseau social est normalement accessible à l'adresse : localhost:4200
- Pour tester plus en détail le backend (avec postman par exemple), ce dernier devrait répondre à l'adresse : localhost:3000
