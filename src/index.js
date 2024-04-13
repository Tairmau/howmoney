const express = require('express');
const path = require('path');
const app = express();
const collection = require('./config.js');
const { error } = require('console');
const session = require('express-session'); // Importez express-session

app.use(session({
    secret: 'gerzgrz46',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

// Data to JSON

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Utiliser du css
app.use(express.static("assets"));

// Routes
app.get("/", (req, res) => {
    res.render("../vues/login");
});
app.get("/login", (req, res) => {
    res.redirect('/login');
});
app.get("/home", (req, res) => {
    const idUser = 6; // Obtenez l'identifiant de l'utilisateur à partir de la session ou d'une autre méthode
    const requete = "SELECT * FROM depenses WHERE fk_user = ?";
    const values = [idUser];

    collection.query(requete, values, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des dépenses :', error);
            return res.status(500).send('Erreur lors de la récupération des dépenses');
        }

        // Rendre la page d'accueil en passant les résultats de la requête à la vue
        res.render("../vues/home", { depenses: results });
    });
});

app.post("/supprimer", (req, res) => {
    
    const idDepense = req.body.idDepense;

    const requete = "DELETE FROM depenses WHERE id_Depenses = ?;";

    const values = [idDepense];

    collection.query(requete, values, (error, result) => {
        if (error) {
            console.error('Erreur lors de linsertion de lutilisateur :', error);
            return res.status(500).send('Erreur lors de linsertion de lutilisateur');
        }
        res.redirect('/home');
        //console.log('Utilisateur inséré avec succès');
        //res.send('Utilisateur inséré avec succès');
    })
});


app.post("/add", (req, res) => {
    
    const data = {
        number: req.body.number,
        dateD: req.body.date

    }

    const requete = "INSERT INTO depenses(date_D, date_A, argent, fk_user) VALUES (?, ?, ?, ?);";

    const dateA = new Date();

    const user_Id = 6;

    const values = [data.dateD,dateA,data.number,user_Id];

    collection.query(requete, values, (error, result) => {
        if (error) {
            console.error('Erreur lors de linsertion de lutilisateur :', error);
            return res.status(500).send('Erreur lors de linsertion de lutilisateur');
        }
        res.redirect('/home');
        //console.log('Utilisateur inséré avec succès');
        //res.send('Utilisateur inséré avec succès');
    })
});
// Login user
app.post("/login", async (req, res) => {
    // Données du formulaire
    const data = {
        identifiant: req.body.identifiant,
        mdp: req.body.mdp
    };

    // Requête SQL pour vérifier les informations de connexion
    const requete = "SELECT * FROM users WHERE email = ? AND mdp = ?";
    const values = [data.identifiant, data.mdp];

    // Exécution de la requête SQL
    collection.query(requete, values, (error, results) => {
        // Si erreur
        if (error) {
            console.error('Erreur lors de la vérification des identifiants :', error);
            return res.status(500).send('Erreur lors de la vérification des identifiants');
        }

        // Vérification du résultat de la requête
        if (results.length > 0) {

            req.session.isLoggedIn = true;
            req.session.user = results[0]['id_user'];
            req.session.userName = results[0]['nom'];


            const nom = req.session.userName;
            res.redirect(`/home`);
        } else {
            // Mauvais identifiants, afficher un message d'erreur
            console.log('Mauvais identifiants');
            res.send('Mauvais identifiants');
        }
    });
});


app.get("/register", (req, res) => {
    res.render("../vues/register");
});

// register someaone
app.post("/register", async (req, res) => {
    const data = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mdp: req.body.mdp,
    }
    
    const requete = "INSERT INTO users(nom,prenom,email,mdp) VALUES (?, ?, ?, ?);";

    const values = [data.nom,data.prenom,data.email,data.mdp];

    collection.query(requete, values, (error, result) => {
        if (error) {
            console.error('Erreur lors de linsertion de lutilisateur :', error);
            return res.status(500).send('Erreur lors de linsertion de lutilisateur');
        }
        res.redirect('/');
        //console.log('Utilisateur inséré avec succès');
        //res.send('Utilisateur inséré avec succès');
    })

});

const port = 5050;
app.listen(port, () => {
    console.log(`Port du serveur : ${port}`);
});
