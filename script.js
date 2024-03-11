var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express
app.use(express.json()); // Add this line to parse JSON request bodies

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.
let allMsgs = [{ "content": "Hello World", "user": "Maxence" },
{ "content": "Blah Blah Blah", "user": "JB" },
{ "content": "I love cats", "user": "Romain" }
];

app.get('/msg/get/*', function(req, res) {
  // Récupérer le numéro de message à partir de l'URL
  const numMsg = parseInt(req.params[0]);

  // Vérifier si le numéro de message est un entier
  if (isNaN(numMsg)) {
    // Numéro de message non valide
    res.json({ "code": 0 });
  } else {
    // Numéro de message valide
    // Vérifier si le numéro de message existe dans la liste des messages
    if (numMsg >= 0 && numMsg < allMsgs.length) {
      // Numéro de message valide et existant
      res.json({ "code": 1, "msg": allMsgs[numMsg] });
    } else {
      // Numéro de message non valide ou non existant
      res.json({ "code": 0 });
    }
  }
});

app.get('/msg/getAll', function(req, res) {
  // Construire la réponse HTTP
  res.json({ "code": 1, "msgs": allMsgs });
});

app.get('/msg/nber', function(req, res) {
  // Construire la réponse HTTP
  res.json({ "code": 1, "nber": allMsgs.length });
});

app.get('/msg/del/*', function(req, res) {
  // Récupérer le numéro de message à partir de l'URL
  const numMsg = parseInt(req.params[0]);

  // Vérifier si le numéro de message est un entier
  if (isNaN(numMsg)) {
    // Numéro de message non valide
    res.json({ "code": 0 });
  } else {
    // Numéro de message valide
    // Vérifier si le numéro de message existe dans la liste des messages
    if (numMsg >= 0 && numMsg < allMsgs.length) {
      // Numéro de message valide et existant
      // Supprimer le message de la liste
      allMsgs.splice(numMsg, 1);

      // Construire la réponse HTTP
      res.json({ "code": 1 });
    } else {
      // Numéro de message non valide ou non existant
      res.json({ "code": 0 });
    }
  }
});

app.post('/msg/post', function(req, res) {
  // Récupérer le message à partir du corps de la requête
  const msg = req.body;

  // Ajouter le message à la liste des messages
  allMsgs.push(msg);

  // Construire la réponse HTTP
  res.json({ "code": 1 });
});

app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

