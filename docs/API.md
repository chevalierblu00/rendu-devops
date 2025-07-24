# Documentation API

## 🔗 Routes API disponibles

### Authentification

#### POST /api/auth/signup
Créer un nouveau compte utilisateur.

**Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "username": "nomutilisateur"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "nomutilisateur"
  }
}
\`\`\`

#### POST /api/auth/signin
Connexion utilisateur.

**Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
\`\`\`

#### POST /api/auth/signout
Déconnexion utilisateur.

### Produits

#### GET /api/products
Récupérer tous les produits.

**Query Parameters:**
- \`page\` (optional): Numéro de page (défaut: 1)
- \`limit\` (optional): Nombre d'éléments par page (défaut: 10)
- \`search\` (optional): Terme de recherche

**Response:**
\`\`\`json
{
  "products": [
    {
      "id": "uuid",
      "title": "Titre du produit",
      "description": "Description du produit",
      "image_url": "https://example.com/image.jpg",
      "user_id": "uuid",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "profiles": {
        "username": "nomutilisateur"
      },
      "comments": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
\`\`\`

#### GET /api/products/[id]
Récupérer un produit spécifique.

**Response:**
\`\`\`json
{
  "id": "uuid",
  "title": "Titre du produit",
  "description": "Description détaillée",
  "image_url": "https://example.com/image.jpg",
  "user_id": "uuid",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "profiles": {
    "username": "nomutilisateur",
    "email": "user@example.com"
  },
  "comments": [
    {
      "id": "uuid",
      "content": "Excellent produit !",
      "created_at": "2024-01-01T00:00:00Z",
      "profiles": {
        "username": "commentateur"
      }
    }
  ]
}
\`\`\`

#### POST /api/products
Créer un nouveau produit (authentification requise).

**Body:**
\`\`\`json
{
  "title": "Nouveau produit",
  "description": "Description du nouveau produit",
  "image_url": "https://example.com/image.jpg"
}
\`\`\`

#### PUT /api/products/[id]
Modifier un produit (propriétaire uniquement).

**Body:**
\`\`\`json
{
  "title": "Titre modifié",
  "description": "Description modifiée",
  "image_url": "https://example.com/new-image.jpg",
  "status": "active"
}
\`\`\`

#### DELETE /api/products/[id]
Supprimer un produit (propriétaire uniquement).

### Commentaires

#### GET /api/products/[id]/comments
Récupérer les commentaires d'un produit.

#### POST /api/products/[id]/comments
Ajouter un commentaire (authentification requise).

**Body:**
\`\`\`json
{
  "content": "Contenu du commentaire"
}
\`\`\`

#### PUT /api/comments/[id]
Modifier un commentaire (auteur uniquement).

#### DELETE /api/comments/[id]
Supprimer un commentaire (auteur uniquement).

### Profil utilisateur

#### GET /api/profile
Récupérer le profil de l'utilisateur connecté.

#### PUT /api/profile
Modifier le profil utilisateur.

**Body:**
\`\`\`json
{
  "username": "nouveaunom",
  "bio": "Ma nouvelle biographie",
  "website": "https://monsite.com"
}
\`\`\`

### Statistiques

#### GET /api/stats
Récupérer les statistiques globales.

**Response:**
\`\`\`json
{
  "totalUsers": 150,
  "totalProducts": 75,
  "totalComments": 300,
  "activeUsers": 45
}
\`\`\`

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT valide dans l'en-tête Authorization:

\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## ❌ Codes d'erreur

### 400 - Bad Request
Données invalides ou manquantes.

### 401 - Unauthorized
Token manquant ou invalide.

### 403 - Forbidden
Permissions insuffisantes.

### 404 - Not Found
Ressource non trouvée.

### 500 - Internal Server Error
Erreur serveur.

## 📝 Format des erreurs

\`\`\`json
{
  "error": true,
  "message": "Description de l'erreur",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`
\`\`\`
