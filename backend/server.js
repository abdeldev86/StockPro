
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./db");

// ==================================
// PRODUITS
// ==================================

app.get("/produits", (req, res) => {
  db.query("SELECT * FROM produits", (erreur, resultats) => {
    if (erreur) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(resultats);
  });
});

// ==================================
// CATEGORIES
// ==================================

// Récupérer toutes les catégories
app.get("/categories", (req, res) => {
  db.query(
    "SELECT * FROM categories ORDER BY nom",
    (erreur, resultats) => {
      if (erreur) {
        return res.status(500).json({ message: "Erreur serveur" });
      }

      res.json(resultats);
    }
  );
});

// Ajouter une nouvelle catégorie
app.post("/categories", (req, res) => {
  const { nom, description } = req.body;

  if (!nom || !nom.trim()) {
    return res.status(400).json({
      message: "Le nom de la catégorie est obligatoire",
    });
  }

  const sql = `
    INSERT INTO categories (nom, description)
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [nom.trim(), description?.trim() || null],
    (erreur, resultat) => {
      if (erreur) {
        if (erreur.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "Cette catégorie existe déjà.",
          });
        }

        console.log("Erreur ajout catégorie :", erreur);

        return res.status(500).json({
          message: "Erreur lors de l'ajout de la catégorie",
        });
      }

      res.status(201).json({
        message: "Catégorie ajoutée avec succès",
        id: resultat.insertId,
      });
    }
  );
});

// Modifier une catégorie
app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { nom, description } = req.body;

  if (!nom || !nom.trim()) {
    return res.status(400).json({
      message: "Le nom de la catégorie est obligatoire",
    });
  }

  const sql = `
    UPDATE categories
    SET nom = ?, description = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nom.trim(), description?.trim() || null, id],
    (erreur, resultat) => {
      if (erreur) {
        if (erreur.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "Une autre catégorie utilise déjà ce nom.",
          });
        }

        console.log("Erreur modification catégorie :", erreur);

        return res.status(500).json({
          message: "Erreur lors de la modification de la catégorie",
        });
      }

      if (resultat.affectedRows === 0) {
        return res.status(404).json({
          message: "Catégorie introuvable",
        });
      }

      res.json({
        message: "Catégorie modifiée avec succès",
      });
    }
  );
});

// Modifier le statut d'une catégorie
app.patch("/categories/:id/statut", (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!["actif", "inactif"].includes(statut)) {
    return res.status(400).json({
      message: "Statut invalide",
    });
  }

  const sql = "UPDATE categories SET statut = ? WHERE id = ?";

  db.query(sql, [statut, id], (erreur, resultat) => {
    if (erreur) {
      return res.status(500).json({
        message: "Erreur lors de la modification du statut",
      });
    }

    if (resultat.affectedRows === 0) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    res.json({
      message: "Statut modifié avec succès",
    });
  });
});

// ==================================
// FOURNISSEURS
// ==================================

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

// ==================================
// DEMARRAGE DU SERVEUR
// ==================================

app.listen(5000, () => {
  console.log("Serveur StockPro démarré sur le port 5000");
});
