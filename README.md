#Readme for project restaurant SERVER
##Commande pour initialiser le projet
1. Télécharger les dépendances du projet en exécutant la commande suivante:
* npm install ou npm i
2. Démarrer le serveur avec la commande suivante:
* npm run dev ou npm run start
* port = 8080
3. Test avec le lien: http://localhost:8080/
##Requête pour obtenir les resources REST
1. Requête HTTP GET http://localhost:8080/find-all-rest
2. Requête HTTP GET http://localhost:8080/find-paginate-resto?size=10&page=2
3. Requête HTTP GET http://localhost:8080/find-resto-by-name?size=10&page=1&name=Morri
4. Requête HTTP GET http://localhost:8080/restau-cords?lat=5.293392199&long=-3.9777088
5. Requête HTTP GET http://localhost:8080/restaurants/5de779325273d39c239ecd43
6. Requête HTTP POST http://localhost:8080/restaurants/
7. Requête HTTP PUT http://localhost:8080/restaurants/5de779325273d39c239ecd43
8. Requête HTTP DELETE http://localhost:8080/restaurants/5de779325273d39c239ecd43