# Architecture du Projet DevOps E-Commerce

## 🏗️ Vue d'ensemble

Cette application suit une architecture moderne basée sur Next.js avec une approche full-stack, utilisant Supabase comme backend-as-a-service pour la base de données et l'authentification.

## 📊 Diagramme d'architecture

\`\`\`mermaid
graph TB
    subgraph "Frontend (Vercel)"
        A[Next.js App Router]
        B[React Components]
        C[Tailwind CSS]
        D[shadcn/ui]
    end
    
    subgraph "Backend Services"
        E[Next.js API Routes]
        F[Supabase Auth]
        G[Supabase Database]
        H[Supabase Storage]
    end
    
    subgraph "CI/CD Pipeline"
        I[GitHub Actions]
        J[Automated Tests]
        K[Build & Deploy]
    end
    
    subgraph "Monitoring"
        L[Vercel Analytics]
        M[Supabase Metrics]
        N[Custom Logs]
    end
    
    A --> E
    A --> F
    E --> G
    F --> G
    I --> J
    J --> K
    K --> A
    A --> L
    G --> M
    E --> N
\`\`\`

## 🔧 Stack Technique

### Frontend
- **Next.js 14** avec App Router
- **React 18** avec Server Components
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes

### Backend
- **Next.js API Routes** pour les endpoints
- **Supabase** pour la base de données PostgreSQL
- **Supabase Auth** pour l'authentification
- **Row Level Security (RLS)** pour la sécurité

### DevOps
- **GitHub Actions** pour CI/CD
- **Vercel** pour le déploiement
- **ESLint** et **Prettier** pour la qualité du code
- **Jest** et **Playwright** pour les tests

## 🗄️ Modèle de données

### Relations entre tables

\`\`\`mermaid
erDiagram
    profiles {
        uuid id PK
        text username UK
        text email
        text bio
        text website
        text role
        timestamp created_at
        timestamp updated_at
    }
    
    products {
        uuid id PK
        text title
        text description
        text image_url
        uuid user_id FK
        text status
        timestamp created_at
        timestamp updated_at
    }
    
    comments {
        uuid id PK
        text content
        uuid user_id FK
        uuid product_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    profiles ||--o{ products : "creates"
    profiles ||--o{ comments : "writes"
    products ||--o{ comments : "has"
\`\`\`

### Politiques RLS

#### Table \`profiles\`
- **SELECT**: Tous les profils sont visibles publiquement
- **INSERT**: Seul l'utilisateur peut créer son profil
- **UPDATE**: Seul l'utilisateur peut modifier son profil

#### Table \`products\`
- **SELECT**: Produits actifs visibles par tous, tous les produits visibles par le propriétaire
- **INSERT**: Utilisateurs connectés peuvent créer des produits
- **UPDATE/DELETE**: Seul le propriétaire peut modifier/supprimer

#### Table \`comments\`
- **SELECT**: Tous les commentaires sont visibles
- **INSERT**: Utilisateurs connectés peuvent commenter
- **UPDATE/DELETE**: Seul l'auteur peut modifier/supprimer

## 🔄 Flux de données

### Authentification
\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant A as Next.js App
    participant S as Supabase Auth
    participant D as Database
    
    U->>A: Login Request
    A->>S: Authenticate
    S->>D: Verify Credentials
    D->>S: User Data
    S->>A: JWT Token
    A->>U: Authenticated Session
\`\`\`

### Création de produit
\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant A as Next.js App
    participant API as API Route
    participant D as Database
    
    U->>A: Create Product Form
    A->>API: POST /api/products
    API->>D: Insert Product
    D->>API: Product Created
    API->>A: Success Response
    A->>U: Redirect to Product
\`\`\`

## 🚀 Pipeline CI/CD

### Workflow de déploiement

\`\`\`mermaid
graph LR
    A[Push to GitHub] --> B[GitHub Actions]
    B --> C[Run Tests]
    C --> D[Build App]
    D --> E{Branch?}
    E -->|dev| F[Deploy to Staging]
    E -->|main| G[Deploy to Production]
    F --> H[Staging URL]
    G --> I[Production URL]
\`\`\`

### Étapes du pipeline

1. **Trigger**: Push sur \`main\`, \`dev\` ou PR
2. **Install**: Installation des dépendances
3. **Lint**: Vérification du code avec ESLint
4. **Type Check**: Vérification TypeScript
5. **Test**: Exécution des tests unitaires et E2E
6. **Build**: Construction de l'application
7. **Deploy**: Déploiement sur Vercel

## 📊 Monitoring et métriques

### Métriques collectées

#### Performance
- Temps de réponse des pages
- Temps de build
- Core Web Vitals

#### Business
- Nombre d'utilisateurs actifs
- Nombre de produits créés
- Nombre de commentaires
- Taux de conversion

#### Technique
- Erreurs JavaScript
- Erreurs API
- Utilisation de la base de données
- Logs d'authentification

### Dashboards

#### Vercel Analytics
- Métriques de performance en temps réel
- Analyse des visiteurs
- Core Web Vitals

#### Supabase Dashboard
- Métriques de base de données
- Authentification
- Utilisation des ressources

## 🔐 Sécurité

### Authentification
- JWT tokens avec expiration
- Refresh tokens automatiques
- Session management côté client

### Autorisation
- Row Level Security (RLS) sur toutes les tables
- Politiques granulaires par rôle
- Validation côté serveur

### Protection des données
- Chiffrement en transit (HTTPS)
- Chiffrement au repos (Supabase)
- Sanitisation des entrées utilisateur
- Protection CSRF

## 🔧 Configuration des environnements

### Développement
- Base de données locale ou Supabase dev
- Hot reload avec Next.js
- Logs détaillés

### Staging
- Réplique de la production
- Tests automatisés
- Données de test

### Production
- Optimisations de performance
- Monitoring complet
- Sauvegardes automatiques

## 📈 Scalabilité

### Horizontal
- Vercel Edge Functions
- CDN global
- Cache intelligent

### Vertical
- Supabase auto-scaling
- Connection pooling
- Optimisation des requêtes

### Optimisations
- Server-side rendering (SSR)
- Static generation (SSG)
- Image optimization
- Code splitting automatique

## 🛠️ Outils de développement

### IDE et extensions recommandées
- VS Code
- TypeScript extension
- Tailwind CSS IntelliSense
- ESLint extension
- Prettier extension

### Scripts de développement
- \`npm run dev\` - Serveur de développement
- \`npm run build\` - Build de production
- \`npm run test\` - Tests
- \`npm run lint\` - Linting

Cette architecture garantit une application moderne, sécurisée et scalable avec un workflow de développement optimisé.
\`\`\`
