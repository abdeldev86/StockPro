
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());



const db = require("./db");



app.get("/produits", (req, res) => {
  db.query("SELECT * FROM produits", (erreur, resultats) => {

    if (erreur) {
      res.status(500).json({ message: "Erreur serveur" });
    } else {
      res.json(resultats)
    }

  });
});


// Récupérer toutes les catégories
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY nom", (erreur, resultats) => {
    if (erreur) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(resultats);
  });
});

// Récupérer tous les fournisseurs actifs
app.get("/fournisseurs", (req, res) => {
  db.query(
    "SELECT * FROM fournisseurs WHERE actif = TRUE ORDER BY nom",
    (erreur, resultats) => {
      if (erreur) {
        return res.status(500).json({ message: "Erreur serveur" });
      }

      res.json(resultats);
    }
  );
});


/*
const produits = [
  { id: 101, nom: "Souris", categorie: "Accessoires", prix: 1500, quantite: 12 },
  { id: 102, nom: "Casque", categorie: "Audio", prix: 3500, quantite: 5 },
  { id: 103, nom: "Clavier", categorie: "Accessoires", prix: 2800, quantite: 8 },
  { id: 104, nom: "Imprimante", categorie: "Accessoires", prix: 22000, quantite: 3 },
];


app.get("/produits", (req, res) => {
  res.json(produits);
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur StockPro !");
});
*/


app.listen(5000, () => {
  console.log("Serveur StockPro démarré sur le port 5000");
});
