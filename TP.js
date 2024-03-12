var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

app.get('/test/*', function(req, res) {
  // Récupérer le chemin après /test/
  const chemin = req.url.split('/')[2];

  // Construire la réponse HTTP
  res.json({ "msg": chemin });
});

let compteur = 0;

app.get('/cpt/query', function(req, res) {
  // Construire la réponse HTTP
  res.json({ "compteur": compteur });
});

app.get('/cpt/inc', function(req, res) {
  // Incrémenter le compteur de 1
  compteur++;

  // Construire la réponse HTTP
  res.json({ "code": 0 });
});

app.get('/cpt/inc', function(req, res) {
  // Récupérer la valeur de l'argument "v"
  const v = req.query.v;

  // Vérifier si "v" est un entier
  if (typeof v === 'number' && !isNaN(v)) {
    // Incrémenter le compteur de "v"
    compteur += v;

    // Construire la réponse HTTP
    res.json({ "code": 0 });
  } else {
    // Ne pas toucher au compteur

    // Construire la réponse HTTP
    res.json({ "code": -1 });
  }
});



app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

