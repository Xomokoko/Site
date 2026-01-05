Parfait.
Voici **une version mise à jour et cohérente de ton README**, **sans émojis**, qui **reflète exactement l’état actuel de ton application**, y compris les **paramètres**, le **Pomodoro personnalisable** et la logique des popups.

Tu peux **remplacer intégralement** ton `README.md` par le contenu ci-dessous.

---

# StudyFlow – Application de gestion d’études

StudyFlow est une application web moderne conçue pour optimiser l’organisation, la concentration et le suivi des études. Elle combine un timer intelligent, un planning automatique, des statistiques détaillées et une gestion de tâches, le tout dans une interface fluide et orientée productivité.

Toutes les données sont stockées localement afin de garantir simplicité, rapidité et respect de la vie privée.

---

## Objectifs du projet

StudyFlow a pour but de fournir un outil tout-en-un pour les étudiants permettant de :

* améliorer la concentration grâce à des sessions de travail structurées,
* organiser efficacement son temps de travail,
* mesurer précisément ses efforts réels,
* analyser sa progression sur le court et le long terme.

---

## Fonctionnalités principales

### Timer intelligent (Pomodoro)

* Mode focus (Pomodoro) avec durée personnalisable
* Pause courte et pause longue
* Sessions personnalisées
* Pause, reprise et réinitialisation
* Barre de progression animée
* Sauvegarde automatique de l’état du timer
* Gestion robuste des pauses (le temps de pause n’est pas comptabilisé)
* Sons de notification à la fin des sessions

### Paramètres utilisateur

* Durée du focus configurable via un slider
* Activation / désactivation du popup « Pause ou session suivante »
* Paramètres persistants via localStorage
* Mise à jour en temps réel dans toute l’application

### Enregistrement des sessions d’étude

* Popup automatique à la fin d’une session de travail
* Saisie de la matière étudiée
* Enchaînement intelligent vers une pause ou une nouvelle session
* Les pauses ne sont pas enregistrées comme temps d’étude

### Gestion des cours

* Création libre des cours
* Possibilité de marquer des cours comme favoris
* Sélection rapide des cours favoris dans les popups
* Persistance complète des données

### Planning automatique

* Assistant de planification pas à pas
* Répartition intelligente des matières
* Prise en compte :

  * des jours disponibles
  * des horaires
  * du nombre de matières par jour
  * d’une durée maximale par session
* Alerte si le planning ne peut pas être généré entièrement

### Statistiques et analyses avancées

* Temps total étudié
* Nombre de sessions
* Durée moyenne par session
* Streak de jours consécutifs
* Répartition du temps par matière
* Graphique du temps par jour de la semaine
* Navigation entre les semaines précédentes
* Comparaison implicite des semaines sans suppression de données

### Gestion des tâches

* Ajout de tâches liées ou non à une matière
* Marquage des tâches comme terminées
* Suppression rapide
* Données persistantes

### Interface et expérience utilisateur

* Interface responsive (mobile / desktop)
* Thème clair et sombre
* Animations fluides
* UX pensée pour limiter les distractions

---

## Architecture technique

### Stack utilisée

* React 18
* Vite
* Tailwind CSS
* React Router
* Recharts
* Lucide React

---

### Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Timer.jsx
│   ├── TodoList.jsx
│   ├── StatCard.jsx
│   └── StudySession.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Planning.jsx
│   ├── Analytics.jsx
│   ├── Cours.jsx
│   ├── Links.jsx
│   └── Settings.jsx
│
├── contexts/
│   ├── TimerContext.jsx
│   └── ModalContext.jsx
│
├── hooks/
│   ├── useTimer.js
│   ├── useStudyData.js
│   ├── useTheme.js
│   └── useNotification.js
│
├── utils/
│   ├── dateHelpers.js
│   ├── planningGenerator.js
│   ├── calculations.js
│   └── storage.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Concepts techniques clés

* Séparation claire entre logique métier, UI et données
* Context API pour le timer, les modals et les paramètres
* Hooks personnalisés pour la réutilisabilité
* Gestion fiable du localStorage (merge des paramètres, migrations)
* Calculs statistiques dynamiques
* Navigation temporelle (semaines précédentes)
* Architecture scalable

---

## Installation et lancement

### Prérequis

* Node.js 16 ou supérieur
* npm ou yarn

### Installation

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

Application accessible sur :

```
http://localhost:5173
```

---

## Données et confidentialité

* Aucune base de données distante
* Aucune API externe
* Toutes les données sont stockées localement sur l’appareil de l’utilisateur

---

## Évolutions prévues

* Paramètres avancés du son (volume, choix des sons)
* Couleurs par cours et affichage dans les graphiques
* Statistiques sur les pauses
* Objectifs quotidiens et hebdomadaires
* Export / import des données
* Mode examen
* Application mobile

---

## Licence

Projet libre pour usage personnel et éducatif.

---

## Contribution

Les suggestions, idées et retours sont encouragés.

---

Si tu veux, au prochain message on continue **exactement comme prévu** avec la fonctionnalité suivante :

**Son ON/OFF + volume + choix des sons (work / break / done)**

Dis-moi simplement : *on continue*.
