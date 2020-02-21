<h1>Readme for project restaurant SERVER</h1>
<h2>Commande pour initialiser le projet</h2>

1. Télécharger les dépendances du projet en exécutant la commande suivante: <br/>
* npm install ou npm i <br/>

2. Démarrer le serveur avec la commande suivante: <br/>
* npm run dev ou npm run start <br/>
* port = 8080 <br/>

3. Test avec le lien: http://localhost:8080/<br/>
<h2>Requête pour obtenir les resources REST</h2>

I. Méthode GET (récupération des données) <br/>
1. Requête HTTP GET http://localhost:8080/find-all-rest <br/>
2. Requête HTTP GET http://localhost:8080/find-paginate-resto?size=10&page=2 <br/>
3. Requête HTTP GET http://localhost:8080/find-resto-by-name?size=10&page=1&name=Morri <br/>
4. Requête HTTP GET http://localhost:8080/restau-cords?lat=5.293392199&long=-3.9777088 <br/>
5. Requête HTTP GET http://localhost:8080/restaurants/{id} <br/>
<br/>

II. Méthode POST (ajout des données)<br/>
6. Requête HTTP POST http://localhost:8080/restaurants/
<br/>

III. Méthode PUT (modification des données)<br/>
7. Requête HTTP PUT http://localhost:8080/restaurants/{id}
<br/>

IV. Méthode DELETE (suppression des données)
<br/>

8. Requête HTTP DELETE http://localhost:8080/restaurants/{id}
<br/>

<h2>Lien du repository GIT de l'app Front-End Angular 8</h2>
<br/>

1. https://github.com/KAMENAN2/restaurant_app_client
