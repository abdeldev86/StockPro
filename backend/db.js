require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

db.connect((erreur) => {
  if (erreur) {
    console.log("Erreur de connexion MySQL :", erreur);
  } else {
    console.log("Connexion à MySQL réussie !");
  }
});

module.exports = db;
