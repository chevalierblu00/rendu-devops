# DevOps E-Commerce Application

Une application e-commerce complète avec authentification, gestion de produits, système de commentaires et déploiement automatisé.

## 🚀 Fonctionnalités

### ✨ Fonctionnalités principales
- **Authentification sécurisée** avec Supabase Auth
- **Gestion de produits** (CRUD complet)
- **Système de commentaires** interactif
- **Rôles utilisateurs** (standard & owner)
- **Dashboard utilisateur** personnalisé
- **Interface responsive** avec Tailwind CSS

### 🔧 Architecture technique
- **Frontend**: Next.js 14 avec App Router
- **Backend**: Next.js API Routes
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **CI/CD**: GitHub Actions
- **Déploiement**: Vercel
- **Monitoring**: Intégré avec métriques personnalisées

## 📋 Prérequis

- Node.js 18+ 
- npm 8+
- Compte Supabase
- Compte Vercel
- Compte GitHub

## 🛠️ Installation

### 1. Cloner le repository
\`\`\`bash
git clone https://github.com/votre-username/devops-ecommerce-app.git
cd devops-ecommerce-app
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 3. Configuration des variables d'environnement

Créer un fichier \`.env.local\` :

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key

# Optionnel pour le développement
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
\`\`\`

### 4. Configuration de la base de données

\`\`\`bash
# Exécuter les scripts SQL dans l'ordre
# 1. scripts/01-create-tables.sql
# 2. scripts/02-rls-policies.sql  
# 3. scripts/03-seed-data.sql
\`\`\`

### 5. Lancer l'application

\`\`\`bash
npm run dev
\`\`\`

L'application sera disponible sur \`http://localhost:3000\`

## 🏗️ Architecture

### Structure du projet
\`\`\`
devops-ecommerce-app/
├── app/                    # Pages Next.js (App Router)
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Dashboard utilisateur
│   ├── products/          # Pages produits
│   └── layout.tsx         # Layout principal
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── dashboard/        # Composants dashboard
│   ├── products/         # Composants produits
│   └── providers/        # Providers React
├── lib/                  # Utilitaires et configuration
│   └── supabase/         # Configuration Supabase
├── scripts/              # Scripts SQL
├── .github/workflows/    # GitHub Actions
└── docs/                 # Documentation
\`\`\`

### Modèle de données

#### Table \`profiles\`
- \`id\` (UUID, PK) - Référence auth.users
- \`username\` (TEXT, UNIQUE)
- \`email\` (TEXT)
- \`bio\` (TEXT, nullable)
- \`website\` (TEXT, nullable)
- \`role\` (TEXT) - 'standard' | 'owner'
- \`created_at\`, \`updated_at\` (TIMESTAMP)

#### Table \`products\`
- \`id\` (UUID, PK)
- \`title\` (TEXT)
- \`description\` (TEXT)
- \`image_url\` (TEXT, nullable)
- \`user_id\` (UUID, FK → profiles.id)
- \`status\` (TEXT) - 'active' | 'inactive' | 'draft'
- \`created_at\`, \`updated_at\` (TIMESTAMP)

#### Table \`comments\`
- \`id\` (UUID, PK)
- \`content\` (TEXT)
- \`user_id\` (UUID, FK → profiles.id)
- \`product_id\` (UUID, FK → products.id)
- \`created_at\`, \`updated_at\` (TIMESTAMP)

## 🔄 CI/CD Pipeline

### Branches
- \`main\` - Production
- \`dev\` - Préprod/Staging  
- \`feature/*\` - Nouvelles fonctionnalités
- \`user/*\` - Développement utilisateur

### Workflow GitHub Actions

1. **Tests automatiques** sur chaque push/PR
2. **Build et validation** du code
3. **Déploiement automatique** :
   - \`dev\` → Staging sur Vercel
   - \`main\` → Production sur Vercel

### Variables d'environnement GitHub

\`\`\`
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
SLACK_WEBHOOK (optionnel)
\`\`\`

## 🧪 Tests

### Tests unitaires
\`\`\`bash
npm run test:unit
\`\`\`

### Tests E2E
\`\`\`bash
npm run test:e2e
\`\`\`

### Coverage
\`\`\`bash
npm run test:coverage
\`\`\`

## 📊 Monitoring

### Métriques suivies
- Nombre d'utilisateurs connectés
- Nombre de produits créés
- Nombre de commentaires
- Performance (temps de réponse)
- Erreurs et exceptions

### Dashboards
- **Vercel Analytics** - Métriques de performance
- **Supabase Dashboard** - Métriques base de données
- **GitHub Actions** - Métriques CI/CD

## 🚀 Déploiement

### Staging
\`\`\`bash
npm run deploy:staging
\`\`\`

### Production
\`\`\`bash
npm run deploy:production
\`\`\`

### URLs
- **Production**: https://devops-ecommerce-app.vercel.app
- **Staging**: https://devops-ecommerce-staging.vercel.app

## 👥 Rôles utilisateurs

### Utilisateur Standard
- Consulter les produits
- Commenter les produits
- Gérer son profil
- Voir ses commentaires

### Owner
- Toutes les permissions Standard
- Créer des produits
- Modifier ses produits
- Supprimer ses produits

## 🔐 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Authentification JWT** via Supabase
- **Validation côté serveur** pour toutes les opérations
- **Sanitisation** des entrées utilisateur
- **HTTPS** obligatoire en production

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit les changements (\`git commit -m 'Add AmazingFeature'\`)
4. Push vers la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📝 Scripts utiles

\`\`\`bash
# Développement
npm run dev              # Lancer en mode développement
npm run build           # Build de production
npm run start           # Lancer en mode production

# Tests
npm run test            # Tous les tests
npm run test:watch      # Tests en mode watch
npm run lint            # Linting du code

# Base de données
npm run db:generate     # Générer les types TypeScript
npm run db:reset        # Reset de la DB
npm run db:seed         # Seed des données de test
\`\`\`

## 📞 Support

- **Issues GitHub**: [Créer un ticket](https://github.com/votre-username/devops-ecommerce-app/issues)
- **Documentation**: Consultez le dossier \`docs/\`
- **Email**: support@devops-store.com

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

---

**Développé avec ❤️ par l'équipe DevOps Store**
\`\`\`
