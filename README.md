# 🛒 DevOps E-Commerce Application

Application e-commerce complète avec authentification, gestion des produits, commentaires et déploiement automatisé.

## 🚀 Fonctionnalités

- ✅ Authentification sécurisée (Supabase Auth)  
- ✅ CRUD produits & système de commentaires  
- ✅ Rôles utilisateurs : *standard* et *owner*  
- ✅ Dashboard personnalisé  
- ✅ UI responsive avec Tailwind CSS  

## 🏗️ Stack Technique

- **Frontend** : Next.js 14 (App Router)  
- **Backend** : Next.js API Routes  
- **DB** : Supabase (PostgreSQL)  
- **CI/CD** : GitHub Actions + Vercel  
- **UI** : Tailwind CSS + shadcn/ui  

---

## 📋 Prérequis

- Node.js 18+
- Compte Supabase
- Compte Vercel
- Compte GitHub

---

## 🛠️ Installation

```bash
git clone https://github.com/votre-username/devops-ecommerce-app.git
cd devops-ecommerce-app
npm install
```
## 📂 Structure du projet

```bash
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
```

## 🗺️ Architecture du système
```bash
[ Utilisateur ] → [ Frontend Next.js ] → [ API Routes ] → [ Supabase (DB & Auth) ]
                                  ↘︎ [ CI/CD GitHub Actions ] → [ Vercel (Cloud) ]
```
- Monitoring : Vercel Analytics (perf), Supabase Dashboard (DB), logs CI/CD.
- Sécurité : RLS activé, Auth JWT, HTTPS en prod.

## 🔗 Tableau des routes

| Route              | Accès  | Description                     |
| ------------------ | ------ | ------------------------------- |
| `/`                | Public | Homepage (stats, login/sign-up) |
| `/auth/signin`     | Public | Connexion utilisateur           |
| `/auth/signup`     | Public | Inscription utilisateur         |
| `/dashboard`       | Auth   | Tableau de bord utilisateur     |
| `/products`        | Public | Liste de tous les produits      |
| `/products/:id`    | Public | Fiche produit + commentaires    |
| `/products/create` | Owner  | Création de produit             |

## 🧩 User Stories

- US01 – En tant qu’utilisateur standard, je peux commenter un produit pour partager mon avis.
- US02 – En tant qu’owner, je peux créer un produit et le gérer depuis mon dashboard.
- US03 – En tant qu’utilisateur, je peux mettre à jour mes informations personnelles depuis le dashboard.

## 🔄 CI/CD

- main → Production (Vercel)
- preprod  → Preproduction (Vercel)
- develop → pour mettre en commun toutes les fonctionnalités finis et valider avant de les mettre sur la preproduction
- feature/* → Développement de nouvelles fonctionnalités

Pipeline GitHub Actions :

    Tests automatiques (unitaires & intégration)
    Build & validation du code
    Déploiement automatique sur Vercel

## 📊 Monitoring

Métriques suivies :

    Nombre d’utilisateurs connectés
    Nombre de produits créés / modifiés
    Nombre de commentaires
    Temps de réponse & erreurs

Dashboards :

    Vercel Analytics → performance frontend
    Supabase Dashboard → usage & base de données

<img width="1918" height="796" alt="image" src="https://github.com/user-attachments/assets/f1bb9719-9a35-4bb4-8ec5-ab2a49aa925d" />

<img width="1918" height="862" alt="image" src="https://github.com/user-attachments/assets/b7a234a7-c51b-44c6-91da-8a619a70c1eb" />


## 🛠️ Scripts & Automatisation

- CI/CD : .github/workflows/deploy.yml
- Base de données : scripts SQL dans /scripts

Déploiement :

    npm run deploy:staging     # Déploiement préprod
    npm run deploy:production  # Déploiement production

## 👥 Rôles Utilisateurs

- Standard : consulter, commenter, gérer profil
- Owner : créer, modifier, supprimer les produits

## 🔐 Sécurité

- Production : https://rendu-devops.vercel.app/
- Préproduction : https://preprod-rendu-devops.vercel.app/
