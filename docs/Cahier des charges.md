# Création d'un réseau social d'entreprise : Cahier des charges

## Principales fonctionnalités
- Création d'utilisateurs (CRUD)
- Les utilisateurs pourront
  - Voir les derniers posts de tous les utilisateurs
  - Voir les derniers posts d'un utilisateur spécifique
  - Publier des images
  - Publier du texte
- Sur chaque posts, les utilisateurs pourront
  - Liker / disliker
  - Commenter
  - Supprimer leur propre post/comment/like
- Modération par des administrateurs qui peuvent
  - Supprimer les posts/commentaires qu'ils jugent inappropriés.
  - Donner/enlever les droits d'admin à un autre utilisateur
- Autres
  - Session persistante au rechargement de la page
  - Système de notification

## Pages
- Login
- Sign-in
- Agora = feed d'actualité
  - Liste des derniers posts
  - Like / Comment
- User = utilisateurs
  - Liste les utilisateurs
  - Barre de recherche d'utilisateur
- User/:id = profil d'un utilisateur
  - Modifier les infos
  - CRUD photo de profil
  - Supprimer le compte
- Notification = Page des notifications d'un utilisateur
  - répertorie les derniers commentaires et likes à l'un de ses posts

## Organisation de travail
- AGILE
- Une première version basique (MVP) sera présentée au client
- Le développement se fera "au fil de l'eau" selon les requêtes du client
- L'objectif de ce projet est de créer ce premier MVP

## Versionning
- Git et GitHub utilisés
- Workflow:
```bash
________________________________________  # Branche Master (dispo sur Github)
 \______/____/_________/_______/_____/__  # Branche Development (dispo sur Github)
  \___/   \_/  \__/\__/  \____/ \_/       # Branches Features (seulement en local)

```
