# Habit Quest

Habit Quest est une application RPG mobile-first de suivi des habitudes.

## V0.2

Cette version ajoute l'authentification Supabase et les fondations de données sécurisées. La logique métier des habitudes et de progression RPG reste volontairement hors périmètre.

## Stack

- React
- TypeScript strict
- Vite
- Tailwind CSS
- Framer Motion (préparé pour les animations futures)
- Supabase Auth et Postgres avec Row Level Security
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
npm test
```

## Écrans

- Dashboard / Quêtes du jour
- Récap (placeholder)
- Profil minimal modifiable
- Connexion et déconnexion
- Inscription avec pseudo et confirmation d'email
- Mot de passe oublié et réinitialisation
- Callback de confirmation d'adresse

## Architecture

Les tables `profiles`, `player_progress`, `habits` et `habit_completions` sont versionnées dans `supabase/migrations`. Toutes les données utilisateur sont protégées par RLS.


## Configuration Supabase

Copiez `.env.example` vers `.env.local`, puis renseignez les valeurs publiques du projet Supabase :

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
```

La clé `service_role` ne doit jamais être utilisée dans l'application React ni ajoutée à Vercel comme variable `VITE_*`.

Dans Supabase Auth, configurez l'URL du site et autorisez au minimum ces redirections :

```text
http://localhost:5173/**
https://habit-quest-silk.vercel.app/**
https://*-ssssskkip-commits.vercel.app/**
```
