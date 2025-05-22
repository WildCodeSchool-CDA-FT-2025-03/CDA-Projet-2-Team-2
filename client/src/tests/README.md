# 🧪 Tests d’intégration – Guide pour l'équipe

---

## ⚙️ Fonctionnement général

Ce dossier contient des **tests d’intégration**, qui valident l’interaction d’un composant React avec son environnement réel ou simulé :

- ✅ **UI + Apollo** : le composant fait une requête GraphQL et réagit à la réponse.
- ✅ **UI + Auth** : le rendu dépend de l’utilisateur connecté (ou non).
- ✅ **UI + Router** : la navigation est gérée avec `react-router-dom`.

> Ces tests sont plus réalistes que les tests unitaires, car ils testent le **comportement complet** du composant avec ses contextes (provider, API simulée, etc.).

---

## 📚 Ressources utiles

- [Testing Library Docs - React](https://testing-library.com/docs/react-testing-library/intro/)
- [Apollo MockedProvider](https://www.apollographql.com/docs/react/development-testing/testing/#mockedprovider)
- [React Router Testing](https://reactrouter.com/6.28.0/router-components/memory-router)
- [Vitest Docs](https://vitest.dev/)

---

## 📁 Structure recommandée

src/
├── tests/
│ ├── SearchBar.test.tsx # test d’intégration du composant SearchBar
│ ├── ProtectedRoute.test.tsx # test de sécurité/redirection
│ └── utils/
│ ├── renderWithProviders.tsx # centralise tous les contextes
│ ├── createMockUser.ts # fabrique de mock User
│ └── createMockDepartement.ts # fabrique de mock Département

--

## 🧰 Utilitaires disponibles

### ✅ `renderWithProviders`

Centralise les contextes pour éviter les répétitions, crée l'environnemet de test à l'image du projet des routes protegées :

```ts
renderWithProviders(<Component />, {
  mocks,              // mocks Apollo
  user,               // utilisateur mocké
  isAuthenticated,    // booléen
  route: '/path'      // chemin initial simulé
});
```


### ✅ `mocks réutilisables` 

### ▶️ EXEMPLE :  'createMockUser.tsx'
Fabrique un utilisateur typé (User) avec des valeurs par défaut réalistes. Permet de tester facilement tous les rôles (DOCTOR, ADMIN, SECRETARY) et statuts (ACTIVE, INACTIVE) sans répéter toute la structure.

- Dans ton test, tu peux faire un import: 

```ts
import { createMockUser } from './utils/createMockUser';
const user = createMockUser({
  role: 'SECRETARY',
  status: 'ACTIVE',
});
```

- Tu peux aussi surcharger des propriétés si besoin :

```ts
const user = createMockUser({
  role: 'DOCTOR',
  status: 'INACTIVE',
  firstname: 'Alice',
  lastname: 'Martin',
});
```

### ▶️ EXEMPLE : 'createMockDepartement.tsx'
Génère un objet Departement typé conforme à GraphQL. Il est utilisé automatiquement dans createMockUser, mais tu peux aussi l’utiliser seul pour des cas spécifiques.

- Dans ton test, tu peux faire un import: 

```ts
import { createMockDepartement } from './utils/createMockDepartement';

const departement = createMockDepartement({
  label: 'Cardiologie',
  level: '2',
  building: 'Bâtiment B',
});
```

- Et l’intégrer manuellement à un utilisateur mocké :

```ts
const dep = createMockDepartement({ label: 'Pédiatrie' });

const user = createMockUser({
  role: 'ADMIN',
  status: 'ACTIVE',
  departement: dep,
});
```








