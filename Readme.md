# Projet de Gestion de Livraisons

Ce projet est destiné à la gestion de livraisons à l'aide de la technologie MEAN Stack (MongoDB, Express, Angular, Node.js).

## Prérequis

- Node.js et npm installés (https://nodejs.org/)
- MongoDB installé localement (https://www.mongodb.com/try/download/community)

## Instructions

1. Clonez ce dépôt vers votre machine locale :
```bash
git clone https://github.com/Shadows97/tracker_api.git

cd tracker_api
```


2. Installez les dépendances :
```
npm install
```


3. Configurez MongoDB en local :
- Assurez-vous que MongoDB est installé et exécuté.
- Créez une base de données nommée "package_delivery".
- Créez un fichier `.env` à la racine du projet et ajoutez le lien de connexion à la base de données, par exemple :
  ```
  MONGODB_URL=mongodb://localhost:27017/package_delivery
  PORT=5000
  ```

4. Lancez le serveur :

```
npm start
```


5. Accédez à la documentation Swagger :
Ouvrez votre navigateur et accédez à l'URL suivante : [http://localhost:PORT/api-docs](http://localhost:PORT/api-docs)
Remplacez `PORT` par le port sur lequel le serveur est en cours d'exécution.

## Contact

Si vous avez des questions ou des problèmes, n'hésitez pas à me contacter à [mpoderrick97@gmail.com](mailto:mpoderrick97@gmail.com).


