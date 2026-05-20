# Mini-projet Blockchain — CertiChain

## 1. Sujet retenu

### **CertiChain — Diplômes numériques Soulbound**

Nous retenons le sujet **Diplôme Soulbound** proposé dans le mini-projet final.

L’idée est de créer une application décentralisée permettant à une université ou à une école de **délivrer des diplômes numériques vérifiables sur la blockchain**.

Un diplôme CertiChain :

- est créé par l’administrateur du contrat ;
- est associé à une adresse Ethereum d’étudiant ;
- est **non transférable** ;
- peut être consulté et vérifié publiquement depuis une DApp ;
- peut éventuellement être révoqué par l’administrateur en cas d’erreur.

Ce sujet est pertinent car il répond à un vrai problème :  
**vérifier l’authenticité d’un diplôme sans dépendre uniquement d’un document papier ou PDF facilement falsifiable.**

---

## 2. Objectif final du projet

À la fin du projet, nous devons livrer :

- un **smart contract Solidity** déployé sur **Sepolia** ;
- une **DApp web fonctionnelle** connectée à MetaMask ;
- un **repository GitHub public** propre ;
- l’**adresse du contrat** visible sur Sepolia Etherscan ;
- un **README complet** ;
- des **captures d’écran** ;
- une **vidéo de démonstration de 3 minutes maximum** ou une présentation orale.

---

## 3. Fonctionnalités prévues

### 3.1. Côté smart contract

Le contrat `DiplomaSoulbound.sol` devra permettre :

1. **Émettre un diplôme**
   - uniquement par le propriétaire du contrat ;
   - vers l’adresse Ethereum d’un étudiant.

2. **Stocker les informations du diplôme**
   - nom ou identifiant étudiant ;
   - intitulé du diplôme ;
   - promotion ou année ;
   - mention / spécialité ;
   - date d’émission ;
   - état du diplôme : valide ou révoqué.

3. **Vérifier un diplôme**
   - lecture par `tokenId` ;
   - affichage des métadonnées du diplôme.

4. **Révoquer un diplôme**
   - uniquement par l’administrateur ;
   - utile en cas d’erreur d’émission.

5. **Empêcher tout transfert**
   - le diplôme est Soulbound ;
   - il ne peut pas être vendu, donné ou déplacé vers un autre portefeuille.

6. **Émettre des événements**
   - `DiplomaIssued`
   - `DiplomaRevoked`

---

### 3.2. Côté DApp

La DApp devra contenir :

#### A. Connexion MetaMask
- bouton **Connecter MetaMask** ;
- affichage de l’adresse connectée ;
- affichage si l’utilisateur est administrateur ou simple visiteur.

#### B. Espace administrateur
- formulaire pour émettre un diplôme ;
- formulaire pour révoquer un diplôme ;
- messages de succès ou d’erreur.

#### C. Espace public de vérification
- champ pour saisir un `tokenId` ;
- bouton **Vérifier le diplôme** ;
- affichage clair :
  - propriétaire ;
  - étudiant ;
  - diplôme ;
  - année ;
  - mention ;
  - statut valide / révoqué.

#### D. Bonus possible
- bouton **Voir mon diplôme** pour afficher automatiquement le diplôme lié au wallet connecté ;
- lien vers la transaction Etherscan après émission ;
- meilleure mise en page responsive.

---

## 4. Structure GitHub cible

```text
certichain-soulbound-diploma/
├── README.md
├── contracts/
│   └── DiplomaSoulbound.sol
├── front/
│   ├── index.html
│   └── app.js
├── test/
│   └── DiplomaSoulbound.test.js
├── scripts/
│   └── deploy.js
└── screenshots/
    ├── dapp-home.png
    ├── issuance-success.png
    ├── verification.png
    ├── revoke.png
    ├── transfer-blocked.png
    └── etherscan.png
```

---

# 5. Dispatch du travail — Groupe de 4

## Vue globale

| Personne | Rôle principal | Livrables principaux |
|---|---|---|
| **Kanto** | Smart contract Solidity | `DiplomaSoulbound.sol` |
| **Fitia** | Frontend DApp avec ethers.js | `front/index.html`, `front/app.js` |
| **Mickael** | Déploiement, tests, validation technique | `scripts/`, `test/`, contrat Sepolia, vérifications |
| **Zo** | README, design, captures, démo | `README.md`, `screenshots/`, script vidéo |

---

# 6. Tâches détaillées par personne

## 6.1. Kanto — Smart contract Solidity

### Mission
Construire le cœur métier du projet : le contrat de diplôme Soulbound.

### Fichiers concernés

```text
contracts/DiplomaSoulbound.sol
```

### Tâches à réaliser

- [ ] Créer le contrat Solidity.
- [ ] Utiliser OpenZeppelin si possible :
  - `ERC721`
  - `Ownable`
- [ ] Définir une structure `Diploma`.
- [ ] Gérer un compteur de `tokenId`.
- [ ] Implémenter `issueDiploma(...)`.
- [ ] Implémenter `getDiploma(tokenId)`.
- [ ] Implémenter `revokeDiploma(tokenId)`.
- [ ] Bloquer les transferts de NFT pour rendre le diplôme non transférable.
- [ ] Ajouter les événements :
  - `DiplomaIssued`
  - `DiplomaRevoked`
- [ ] Ajouter des `require(...)` avec messages d’erreur compréhensibles.
- [ ] Ajouter de la documentation NatSpec sur les fonctions principales.

### Résultat attendu
Un contrat clair, compilable, sécurisé, et prêt à être déployé sur Sepolia.

---

## 6.2. Fitia — Frontend DApp

### Mission
Créer l’interface utilisateur qui communique avec le contrat via MetaMask et ethers.js.

### Fichiers concernés

```text
front/index.html
front/app.js
```

### Tâches à réaliser

- [ ] Créer la structure HTML de la DApp.
- [ ] Ajouter un design simple, propre et lisible.
- [ ] Intégrer `ethers.js`.
- [ ] Ajouter le bouton **Connecter MetaMask**.
- [ ] Afficher l’adresse connectée.
- [ ] Lire l’adresse du propriétaire du contrat.
- [ ] Afficher si le wallet connecté est admin ou non.
- [ ] Créer le formulaire **Émettre un diplôme** :
  - adresse étudiant ;
  - nom ou identifiant ;
  - diplôme ;
  - année ;
  - mention / spécialité.
- [ ] Créer le formulaire **Révoquer un diplôme**.
- [ ] Créer le formulaire **Vérifier un diplôme**.
- [ ] Afficher les données du diplôme dans une carte lisible.
- [ ] Afficher les erreurs en cas de :
  - wallet non connecté ;
  - mauvais réseau ;
  - champ vide ;
  - diplôme inexistant ;
  - action admin lancée par un non-owner.
- [ ] Afficher un message de succès après transaction.

### Résultat attendu
Une DApp fonctionnelle permettant d’émettre, vérifier et révoquer un diplôme via le smart contract.

---

## 6.3. Mickael — Déploiement, tests et validation technique

### Mission
S’assurer que le projet fonctionne réellement de bout en bout sur Sepolia.

### Fichiers concernés

```text
scripts/deploy.js
test/DiplomaSoulbound.test.js
README.md pour l'adresse du contrat
```

### Tâches à réaliser

- [ ] Définir la stratégie de déploiement :
  - Remix au minimum ;
  - Hardhat en bonus si retenu.
- [ ] Déployer le contrat sur Sepolia.
- [ ] Copier l’adresse du contrat.
- [ ] Vérifier le contrat sur Etherscan si possible.
- [ ] Tester manuellement :
  - émission par l’owner ;
  - émission refusée par un non-owner ;
  - consultation d’un diplôme ;
  - révocation ;
  - impossibilité de transfert.
- [ ] Créer des tests unitaires si faisable :
  - `issueDiploma()` fonctionne ;
  - `issueDiploma()` échoue pour un non-owner ;
  - `revokeDiploma()` fonctionne ;
  - transfert bloqué.
- [ ] Aider Fitia à intégrer :
  - l’adresse du contrat ;
  - l’ABI ;
  - les appels exacts.
- [ ] Fournir les liens Etherscan nécessaires au README.

### Résultat attendu
Un contrat déployé sur Sepolia, des scénarios vérifiés, et si possible des tests unitaires bonus.

---

## 6.4. Zo — README, captures, UX et démonstration

### Mission
Transformer le travail technique en rendu propre, clair et convaincant.

### Fichiers concernés

```text
README.md
screenshots/
script_demo.md
```

### Tâches à réaliser

- [ ] Proposer une identité simple du projet :
  - nom CertiChain ;
  - slogan ;
  - petite charte visuelle si utile.
- [ ] Améliorer l’UX avec Fitia :
  - titres ;
  - sections bien séparées ;
  - messages clairs ;
  - rendu propre des cartes diplôme.
- [ ] Préparer les captures :
  - accueil DApp ;
  - connexion MetaMask ;
  - émission d’un diplôme ;
  - vérification ;
  - révocation ;
  - tentative de transfert refusée ;
  - transaction Etherscan.
- [ ] Rédiger un README complet avec :
  - présentation ;
  - problème traité ;
  - fonctionnalités ;
  - architecture ;
  - installation ;
  - utilisation ;
  - adresse du contrat Sepolia ;
  - lien Etherscan ;
  - lien démo vidéo ;
  - captures d’écran.
- [ ] Préparer le scénario de la vidéo de 3 minutes.
- [ ] Monter ou coordonner la vidéo finale.
- [ ] Vérifier la cohérence finale du repository GitHub.

### Résultat attendu
Un rendu final lisible, professionnel et conforme aux attentes du mini-projet.

---

# 7. Travail commun obligatoire

Certaines tâches doivent être faites ensemble :

## Réunion 1 — Validation du périmètre
- [ ] Confirmer le sujet CertiChain.
- [ ] Valider la structure des données du diplôme.
- [ ] Valider les fonctions du contrat.
- [ ] Valider la répartition des tâches.

## Réunion 2 — Intégration contrat + front
- [ ] Kanto explique les fonctions finales du contrat.
- [ ] Mickael fournit l’adresse et l’ABI.
- [ ] Fitia connecte le front au contrat.
- [ ] Zo note les étapes pour le README.

## Réunion 3 — Préparation du rendu
- [ ] Tester la démo complète.
- [ ] Vérifier toutes les captures.
- [ ] Vérifier le README.
- [ ] Répéter la vidéo ou présentation orale.

---

# 8. Planning conseillé

| Période | Objectif |
|---|---|
| J1 | Validation du sujet et création du repo GitHub |
| J2–J4 | Développement du contrat Solidity |
| J3–J6 | Construction du front-end DApp |
| J5–J7 | Déploiement Sepolia et intégration front/contrat |
| J8–J9 | Tests complets et corrections |
| J10–J11 | README, captures, organisation GitHub |
| J12 | Bonus éventuels : tests unitaires, GitHub Pages |
| J13 | Vidéo de démonstration |
| J14 | Relecture et rendu final |

---

# 9. Bonus à viser et dispatch associé

Les bonus du sujet doivent aussi être répartis clairement afin qu’ils ne soient pas oubliés.

| Bonus | Responsable principal | Aide possible | Résultat attendu |
|---|---|---|---|
| **Utilisation d’OpenZeppelin** | **Kanto** | Mickael | Le contrat utilise au minimum `ERC721` et `Ownable` pour une base propre et sécurisée. |
| **Documentation NatSpec** | **Kanto** | Zo pour la relecture | Les fonctions principales du contrat contiennent des commentaires `/// @notice`, `/// @param`, `/// @return` quand nécessaire. |
| **Tests unitaires Hardhat ou Foundry** | **Mickael** | Kanto | Un fichier de tests couvre l’émission, la révocation, les droits owner/non-owner et le blocage des transferts. |
| **Déploiement du front sur GitHub Pages** | **Fitia** | Zo | La DApp est accessible via une URL publique ajoutée dans le README. |
| **Captures et mise en valeur des bonus dans le README** | **Zo** | Toute l’équipe | Le README mentionne clairement les bonus réalisés avec captures ou preuves si utile. |

## 9.1. Détail des bonus par personne

### Kanto — Bonus contrat

- [ ] Intégrer **OpenZeppelin** :
  - `ERC721`
  - `Ownable`
- [ ] Vérifier que la logique Soulbound reste compatible avec l’héritage utilisé.
- [ ] Ajouter de la documentation **NatSpec** sur :
  - `issueDiploma(...)`
  - `revokeDiploma(...)`
  - `getDiploma(...)`
  - toute fonction publique importante.
- [ ] Informer Zo des bonus réellement finalisés pour qu’ils soient valorisés dans le README.

### Fitia — Bonus publication front

- [ ] Préparer le dossier `front/` pour un déploiement statique.
- [ ] Vérifier que les chemins CSS/JS fonctionnent sur GitHub Pages.
- [ ] Déployer la DApp sur **GitHub Pages**.
- [ ] Fournir l’URL publique à Zo pour l’ajouter dans le README.
- [ ] Tester l’ouverture de la DApp depuis l’URL publique.

### Mickael — Bonus tests unitaires

- [ ] Mettre en place **Hardhat** ou **Foundry** si le groupe choisit d’ajouter les tests.
- [ ] Écrire les tests principaux :
  - owner peut émettre un diplôme ;
  - non-owner ne peut pas émettre ;
  - un diplôme peut être lu ;
  - owner peut révoquer ;
  - non-owner ne peut pas révoquer ;
  - un transfert de diplôme est refusé.
- [ ] Exécuter les tests et récupérer une capture ou un résumé propre des résultats.
- [ ] Fournir à Zo les commandes nécessaires pour les documenter dans le README.

### Zo — Bonus documentation et valorisation

- [ ] Ajouter dans le README une section :
  ```md
  ## Bonus réalisés
  ```
- [ ] Y mentionner clairement :
  - OpenZeppelin ;
  - NatSpec ;
  - tests unitaires ;
  - GitHub Pages.
- [ ] Ajouter les preuves utiles :
  - capture des tests réussis ;
  - lien GitHub Pages ;
  - mention des librairies OpenZeppelin utilisées.
- [ ] Vérifier que ces bonus sont également cités brièvement dans la vidéo de démo.

## 9.2. Bonus non retenu

Le bonus **Chainlink VRF / Price Feed** n’est pas retenu, car il correspond surtout à la **loterie on-chain** ou à des scénarios de prix, et n’est pas nécessaire pour le projet **CertiChain — Diplôme Soulbound**.

---

# 10. Définition du projet terminé

Le projet sera considéré comme terminé lorsque :

- [ ] le contrat est compilable sans erreur ;
- [ ] le contrat est déployé sur Sepolia ;
- [ ] la DApp se connecte à MetaMask ;
- [ ] l’admin peut émettre un diplôme ;
- [ ] le public peut vérifier un diplôme ;
- [ ] l’admin peut révoquer un diplôme ;
- [ ] le diplôme ne peut pas être transféré ;
- [ ] le README est complet ;
- [ ] les captures sont prêtes ;
- [ ] la vidéo ou présentation est prête ;
- [ ] le repository GitHub public est propre.

---

# 11. Résumé rapide du dispatch

| Personne | À retenir |
|---|---|
| **Kanto** | Développe le smart contract |
| **Fitia** | Développe la DApp |
| **Mickael** | Déploie, teste et valide techniquement |
| **Zo** | Prépare le README, les captures et la démo |

---

# 12. Sujet à suivre

## **CertiChain — Diplômes Soulbound vérifiables sur blockchain**

C’est ce document qui servira de feuille de route au groupe pendant tout le mini-projet.
