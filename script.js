require('dotenv').config()
var fs = require('fs');

var express = require('express');
var app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Chemin du fichier JSON où seront stockés les messages
const msgsFilePath = './messages.json';

// Charger les messages depuis le fichier s'il existe
let allMsgs = [];
try {
    const data = fs.readFileSync(msgsFilePath, 'utf8');
    allMsgs = JSON.parse(data);
} catch (err) {
    console.log("Aucun fichier de messages trouvé ou erreur de lecture. Création d'un nouveau fichier.");
    allMsgs = [
        { "content": "Hello World", "user": "Maxence" },
        { "content": "Blah Blah Blah", "user": "JB" },
        { "content": "I love cats", "user": "Romain" }
    ];
    fs.writeFileSync(msgsFilePath, JSON.stringify(allMsgs, null, 2), 'utf8');
}

// Fonction pour mettre à jour le fichier JSON
function updateMsgsFile() {
    fs.writeFileSync(msgsFilePath, JSON.stringify(allMsgs, null, 2), 'utf8');
}

// Ici on va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.
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
            res.status(200).json({ "msg": allMsgs[numMsg] });
        } else {
            // Numéro de message non valide ou non existant
            res.json({ "code": 0 });
        }
    }
});

app.get('/msg/getAll', function(req, res) {
    // Construire la réponse HTTP
    res.status(200).json({ "msgs": allMsgs });
});

app.get('/msg/nber', function(req, res) {
    // Construire la réponse HTTP
    res.status(200).json({ "nber": allMsgs.length });
});

app.delete('/msg/del/*', function(req, res) {
    // Récupérer le numéro de message à partir de l'URL
    const numMsg = parseInt(req.params[0]);

    // Vérifier si le numéro de message est un entier
    if (isNaN(numMsg)) {
        // Numéro de message non valide
        res.status(400).json({ "message": "Numéro de message non valide" });
    } else {
        // Numéro de message valide
        // Vérifier si le numéro de message existe dans la liste des messages
        if (numMsg >= 0 && numMsg < allMsgs.length) {
            // Numéro de message valide et existant
            // Supprimer le message de la liste
            allMsgs.splice(numMsg, 1);
            updateMsgsFile();

            // Construire la réponse HTTP
            res.status(200);
        } else {
            // Numéro de message non valide ou non existant
            res.status(404).json({ "message": "Message non trouvé" });
        }
    }
});

app.post('/msg/post', function(req, res) {
    // Récupérer le message à partir du corps de la requête
    const msg = req.body;

    // Ajouter le message à la liste des messages
    allMsgs.push(msg);
    updateMsgsFile();

    // Construire la réponse HTTP
    res.status(200);
});

app.post('/login', function(req, res) {
    // Récupérer les identifiants à partir du corps de la requête
    const { username, password } = req.body;

    // Parser la chaîne JSON des utilisateurs depuis les variables d'environnement
    const users = JSON.parse(process.env.USERS);

    // Vérifier si l'utilisateur existe et si le mot de passe correspond
    if (users[username] && users[username] === password) {
        // Identifiants valides, renvoyer le code 200 OK
        res.status(200).json({ "message": "Connexion réussie" });
    } else {
        // Identifiants invalides, renvoyer le code 401 Unauthorized
        res.status(401).json({ "message": "Échec de la connexion" });
    }
});

app.listen(process.env.APP_PORT);
console.log("App listening on port " + process.env.APP_PORT + "...");
