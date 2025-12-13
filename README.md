# Application de gestion d’événements

Projet réalisé dans le cadre du cours de développement web.
L’objectif est de concevoir une application permettant de créer, administrer et consulter des événements, avec gestion des inscriptions et des rôles utilisateurs.

- Frontend : React + Vite
- Backend : Node.js + Express
- Base de données : PostgreSQL
- ORM : Sequelize
- Authentification : JWT
- Conteneurisation : Docker 

##  Fonctionnalités

### 1 - Utilisateur
- Consulter la liste des événements
- Voir le détail d’un événement
- S’inscrire à un événement
- Consulter ses inscriptions

### 2 - Administrateur
- Créer, modifier et supprimer des événements
- Consulter les inscriptions à un événement
- Accès réservé via rôle ADMIN

##  Sécurité & rôles

- Deux rôles : USER et ADMIN
- Authentification par JWT
- Routes protégées côté backend (middlewares)
- Interface adaptée selon le rôle côté frontend
- Un utilisateur n’accède qu’à ses propres données
- Les routes admin sont inaccessibles aux utilisateurs standards

## Composant générique

Un composant générique de type tableau (GenericTable) est utilisé pour :
- afficher la liste des événements
- afficher les inscriptions d’un utilisateur
- afficher les inscriptions à un événement (admin)

##  Lancer le projet

### Démarrage
docker compose up --build
