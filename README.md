# Habit Quest

Habit Quest est une application RPG mobile-first de suivi des habitudes.

## V0.1

Cette version pose uniquement le squelette React/TypeScript/Vite/Tailwind et l'interface visuelle. La logique métier, l'authentification Supabase et la persistance seront ajoutées ultérieurement.

## Stack

- React
- TypeScript strict
- Vite
- Tailwind CSS
- Framer Motion (préparé pour les animations futures)
- Supabase (dépendance et emplacement préparés, sans connexion fonctionnelle)
- Vercel

## Lancer le projet

```bash
npm install
npm run dev
```

Vérifications :

```bash
npm run lint
npm run build
```

## Écrans

- Dashboard / Quêtes du jour
- Récap (placeholder)
- Profil (placeholder)
- Connexion
- Inscription

## Architecture

Les domaines futurs (auth, personnage, quêtes, inventaire, XP, statistiques, récompenses et classes émergentes) sont représentés par des types, dossiers ou placeholders sans logique métier.


## Configuration Supabase

Copiez `.env.example` vers `.env.local`, puis renseignez les valeurs publiques du projet Supabase :

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
```

La clé `service_role` ne doit jamais être utilisée dans l'application React ni ajoutée à Vercel comme variable `VITE_*`.
