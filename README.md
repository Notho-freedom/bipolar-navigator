# BipolarCare — Compagnon de suivi bipolaire

Application web de suivi quotidien conçue pour les personnes vivant avec un trouble bipolaire. Elle permet de suivre son humeur, ses médicaments, et d'accéder rapidement à des ressources en cas de crise.

## ✨ Fonctionnalités

- **Suivi de l'humeur** : Enregistrez votre humeur quotidienne avec notes, sommeil et énergie
- **Gestion des médicaments** : Suivez vos traitements et votre observance
- **Insights personnalisés** : Visualisez vos tendances et recevez des recommandations
- **Ressources de crise** : Accès rapide aux numéros d'urgence et contacts de confiance
- **Authentification sécurisée** : Vos données restent privées grâce à Supabase Auth

## 🛠️ Stack technique

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + shadcn/ui
- **Backend** : Supabase (Auth, Database, Row Level Security)
- **State** : TanStack Query (React Query)

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ (recommandé : utiliser [nvm](https://github.com/nvm-sh/nvm))
- Un projet Supabase (gratuit sur [supabase.com](https://supabase.com))

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Notho-freedom/bipolar-navigator.git
cd bipolar-navigator

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos clés Supabase (voir ci-dessous)

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:8080](http://localhost:8080)

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_publique_anon
```

> Vous trouverez ces valeurs dans votre dashboard Supabase : **Project Settings → API**

### Base de données

Les migrations SQL sont dans `supabase/migrations/`. Si vous utilisez Supabase CLI :

```bash
supabase db push
```

Sinon, exécutez manuellement le contenu du fichier de migration dans l'éditeur SQL de votre dashboard Supabase.

## 📁 Structure du projet

```
src/
├── components/
│   ├── dashboard/    # Composants du tableau de bord
│   ├── layout/       # Header, navigation
│   └── ui/           # Composants shadcn/ui
├── hooks/            # Hooks React (auth, data fetching)
├── integrations/     # Client et types Supabase
├── lib/              # Utilitaires
└── pages/            # Pages de l'application
    ├── Index.tsx     # Dashboard principal
    ├── Mood.tsx      # Suivi de l'humeur
    ├── Medications.tsx # Gestion des médicaments
    ├── Insights.tsx  # Analyses et tendances
    └── Auth.tsx      # Connexion / Inscription
```

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (port 8080) |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Vérifier le code avec ESLint |

## ⚠️ Avertissement

Cette application est un outil d'accompagnement et **ne remplace en aucun cas un suivi médical professionnel**. En cas de crise, contactez immédiatement les services d'urgence (112) ou une ligne d'écoute spécialisée.

## 📄 Licence

MIT — voir [LICENSE](LICENSE) pour les détails.
