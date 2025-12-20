# StudyFlow - Application de Gestion d'Études

Application moderne et élégante pour gérer vos sessions d'étude, avec timer Pomodoro, planning hebdomadaire et analyses statistiques.

## Fonctionnalités

-  **Timer Pomodoro** : Focus de 25 minutes avec pauses personnalisables
- **Planning hebdomadaire** : Organisez vos sessions d'étude
- **Analyses détaillées** : Graphiques et statistiques de vos progrès
- **Liste de tâches** : Gérez vos objectifs quotidiens
- **Notifications** : Alertes de fin de session
- **Sauvegarde locale** : Toutes vos données sont stockées localement

## Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Ouvrez le terminal dans le dossier du projet**
   ```bash
   cd mon-app-etudes
   ```

2. **Installez les dépendances** (si pas déjà fait)
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur**
   - L'application sera disponible sur `http://localhost:5173`
   - Le terminal vous montrera l'URL exacte

## Structure du Projet

```
mon-app-etudes/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── Timer.jsx
│   │   ├── TodoList.jsx
│   │   ├── StatCard.jsx
│   │   └── StudySession.jsx
│   ├── pages/            # Pages principales
│   │   ├── Dashboard.jsx
│   │   ├── Planning.jsx
│   │   └── Analytics.jsx
│   ├── hooks/            # Hooks personnalisés
│   │   ├── useTimer.js
│   │   ├── useStudyData.js
│   │   └── useNotification.js
│   ├── utils/            # Fonctions utilitaires
│   │   ├── storage.js
│   │   ├── dateHelpers.js
│   │   └── calculations.js
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
└── package.json
```

## Technologies Utilisées

- **React** : Framework JavaScript
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **React Router** : Navigation entre pages
- **Recharts** : Bibliothèque de graphiques
- **Lucide React** : Icônes modernes
- **date-fns** : Manipulation de dates

## Utilisation

### Timer Pomodoro
1. Choisissez un mode (Focus 25min, Pause courte 5min, Pause longue 15min)
2. Cliquez sur "Démarrer"
3. À la fin, enregistrez votre session avec la matière étudiée

### Planning
1. Naviguez entre les semaines avec les flèches
2. Cliquez sur "Ajouter" pour planifier une session
3. Visualisez vos sessions prévues et réalisées

### Analyses
1. Consultez vos statistiques globales
2. Analysez le temps par matière avec les graphiques
3. Identifiez vos jours les plus productifs

## Commandes Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 📝 Personnalisation

### Ajouter une nouvelle matière
Les matières sont automatiquement créées quand vous enregistrez une session. Tapez simplement le nom de votre matière.

### Modifier les durées du timer
Dans `src/components/Timer.jsx`, modifiez l'objet `modes` pour changer les durées par défaut.

### Changer les couleurs
Les couleurs sont définies dans `tailwind.config.js`. Vous pouvez personnaliser les couleurs primaires et secondaires.

## Résolution de Problèmes

### L'application ne se lance pas
- Vérifiez que Node.js est installé : `node --version`
- Réinstallez les dépendances : `rm -rf node_modules && npm install`

### Les notifications ne fonctionnent pas
- Autorisez les notifications dans les paramètres de votre navigateur
- Cliquez sur "Autoriser" quand le navigateur vous le demande

### Les données ne se sauvegardent pas
- Vérifiez que le localStorage est activé dans votre navigateur
- Ne pas utiliser le mode navigation privée

## Prochaines Fonctionnalités (À Venir)

- [ ] Mode sombre
- [ ] Export des données en PDF
- [ ] Objectifs hebdomadaires personnalisables
- [ ] Sons de notification personnalisables
- [ ] Synchronisation cloud (optionnelle)
- [ ] Application mobile

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et éducatif.

## 🤝 Contribution

N'hésitez pas à proposer des améliorations ou à signaler des bugs !

---

**Bonne étude ! 🎓✨**