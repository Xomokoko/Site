# StudyFlow – Application de Gestion d'Études

StudyFlow est une application web moderne conçue pour **optimiser l'organisation, la concentration et le suivi des études**. Elle combine un **timer intelligent**, un **planning automatique**, un **suivi statistique avancé** et une **gestion de tâches**, le tout avec une interface élégante et fluide.

---

## Vision du projet

L'objectif de StudyFlow est de fournir un **outil tout-en-un pour les étudiants**, permettant :

* de mieux se concentrer (Pomodoro & sessions personnalisées),
* de planifier intelligemment son temps,
* d'analyser ses efforts réels,
* de progresser de manière mesurable et motivante.

Toutes les données sont stockées **localement**, garantissant simplicité, rapidité et respect de la vie privée.

---

## Fonctionnalités principales

### Timer intelligent

* Pomodoro (25 min)
* Pause courte / longue
* Durée personnalisée (1 à 120 min)
* Barre de progression circulaire animée
* Pause, reprise, réinitialisation
* Sauvegarde automatique des sessions
* Sons de notification (travail / pause)

### Enregistrement guidé des sessions

* Modal de fin de session
* Choix de la matière étudiée
* Enchaînement intelligent (continuer / pause)

### Planning automatique

* Assistant pas à pas (wizard)
* Répartition intelligente des matières
* Respect :

  * des jours disponibles
  * des horaires
  * du nombre de matières par jour
  * d'une durée max de 2h par session
* Alerte si tout ne peut pas être planifié

### Analyses & statistiques avancées

* Temps total étudié
* Moyenne journalière
* Répartition par matière
* Graphiques par jour de la semaine
* Comparaison semaine actuelle / précédente
* Streak de jours consécutifs
* Objectifs recommandés automatiquement

### Gestion des tâches

* Ajout de tâches avec matière optionnelle
* Statut à faire / terminé
* Suppression fluide
* Persistance locale

### Interface moderne

* Thème clair / sombre
* Animations douces
* Design responsive
* UX pensée pour la concentration

---

## Architecture technique

### Stack

* **React 18**
* **Vite** (build ultra-rapide)
* **Tailwind CSS** (design system)
* **React Router** (navigation)
* **Recharts** (graphiques)
* **Lucide React** (icônes)
* **date-fns** (dates en français)

---

### Structure du projet

```
mon-app-etudes/
├── src/
│   ├── components/        # Composants UI
│   │   ├── Navbar.jsx
│   │   ├── Timer.jsx
│   │   ├── TodoList.jsx
│   │   ├── StatCard.jsx
│   │   └── StudySession.jsx
│   │
│   ├── pages/             # Pages principales
│   │   ├── Dashboard.jsx
│   │   ├── Planning.jsx
│   │   ├── Analytics.jsx
│   │   ├── Cours.jsx
│   │   └── Links.jsx
│   │
│   ├── contexts/          # Context API
│   │   ├── TimerContext.jsx
│   │   └── ModalContext.jsx
│   │
│   ├── hooks/             # Hooks personnalisés
│   │   ├── useTimer.js
│   │   ├── useStudyData.js
│   │   ├── useTheme.js
│   │   └── useNotification.js
│   │
│   ├── utils/             # Logique métier
│   │   ├── dateHelpers.js
│   │   ├── planningGenerator.js
│   │   ├── calculations.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│   ├── ding.wav
│   ├── notification.mp3
│   └── break.mp3
│
├── package.json
└── README.md
```

---

## Concepts clés implémentés

* **Séparation claire UI / logique / données**
* **Context API** pour le timer et les modals
* **Hooks métier réutilisables**
* **Génération algorithmique de planning**
* **Calculs statistiques dynamiques**
* **Gestion robuste du localStorage**
* **Design system Tailwind personnalisé**

---

## Installation & démarrage

### Prérequis

* Node.js ≥ 16
* npm ou yarn

### Installation

```bash
npm install
```

### Lancement

```bash
npm run dev
```

Application accessible sur :

```
http://localhost:5173
```

---

## Personnalisation

### Modifier les durées du timer

`TimerContext.jsx` → objet `modes`

### Thème & couleurs

`tailwind.config.js` et `index.css`

### Matières

Créées automatiquement lors de l'enregistrement des sessions

---

## Données & confidentialité

* Aucune base de données
* Aucune API externe
* Données stockées uniquement en **localStorage**

---

## Améliorations possibles

* [ ] Export PDF / CSV
* [ ] Authentification optionnelle
* [ ] Synchronisation cloud
* [ ] Notifications système avancées
* [ ] Application mobile
* [ ] Gamification (badges, niveaux)

---

## Licence

Projet libre pour usage personnel et éducatif.

---

## Contribution

Les idées, feedbacks et améliorations sont les bienvenus

---

**Bonne étude et bon focus**
