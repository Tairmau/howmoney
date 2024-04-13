// Appel de mysql
const mysql = require('mysql');

// Données de connexion
const connexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestionfinances'
});

// Connect to the database
connexion.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

module.exports = connexion;