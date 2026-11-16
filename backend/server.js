
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
      console.log("Erreur récupération produits :", erreur);
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
        console.log("Erreur récupération catégories :", erreur);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      res.json(resultats);
    }
  );
});

// Ajouter une nouvelle catégorie
app.post("/categories", (req, res) => {
  const { nom, description } = req.body;

  if (typeof nom !== "string" || !nom.trim()) {
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
    [nom.trim(), typeof description === "string" ? description.trim() || null : null],
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
  const id = Number(req.params.id);
  const { nom, description } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Identifiant invalide" });
  }

  if (typeof nom !== "string" || !nom.trim()) {
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
    [nom.trim(), typeof description === "string" ? description.trim() || null : null, id],
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
  const id = Number(req.params.id);
  const { statut } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Identifiant invalide" });
  }

  if (!["actif", "inactif"].includes(statut)) {
    return res.status(400).json({
      message: "Statut invalide",
    });
  }

  const sql = "UPDATE categories SET statut = ? WHERE id = ?";

  db.query(sql, [statut, id], (erreur, resultat) => {
    if (erreur) {
      console.log("Erreur statut catégorie :", erreur);
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

// Récupérer tous les fournisseurs
app.get("/fournisseurs", (req, res) => {
  const sql = `
    SELECT *
    FROM fournisseurs
    ORDER BY nom
  `;

  db.query(sql, (erreur, resultats) => {
    if (erreur) {
      console.log("Erreur récupération fournisseurs :", erreur);

      return res.status(500).json({
        message: "Erreur lors de la récupération des fournisseurs",
      });
    }

    res.json(resultats);
  });
});

// Récupérer un fournisseur par son ID
app.get("/fournisseurs/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Identifiant fournisseur invalide",
    });
  }

  db.query(
    "SELECT * FROM fournisseurs WHERE id = ?",
    [id],
    (erreur, resultats) => {
      if (erreur) {
        console.log("Erreur récupération fournisseur :", erreur);

        return res.status(500).json({
          message: "Erreur lors de la récupération du fournisseur",
        });
      }

      if (resultats.length === 0) {
        return res.status(404).json({
          message: "Fournisseur introuvable",
        });
      }

      res.json(resultats[0]);
    }
  );
});

// Ajouter un fournisseur
app.post("/fournisseurs", (req, res) => {
  const donnees = req.body;

  if (
    typeof donnees.nom !== "string" ||
    !donnees.nom.trim()
  ) {
    return res.status(400).json({
      message: "Le nom du fournisseur est obligatoire",
    });
  }

  if (
    typeof donnees.telephone !== "string" ||
    !donnees.telephone.trim()
  ) {
    return res.status(400).json({
      message: "Le numéro de téléphone est obligatoire",
    });
  }

  const type = donnees.type || "entreprise";

  if (!["entreprise", "particulier"].includes(type)) {
    return res.status(400).json({
      message: "Type de fournisseur invalide",
    });
  }

  const champs = [
    "nom",
    "telephone",
    "email",
    "adresse",
    "ville",
    "notes",
    "type",
    "raison_sociale",
    "nom_commercial",
    "forme_juridique",
    "rc",
    "nif",
    "nis",
    "article_fiscal",
    "telephone_secondaire",
    "site_web",
    "wilaya",
    "code_postal",
    "pays",
    "contact_nom",
    "contact_fonction",
    "contact_telephone",
    "contact_email",
    "mode_paiement",
    "delai_paiement",
    "banque",
    "rib",
  ];

  const valeurs = champs.map((champ) => {
    const valeur = donnees[champ];

    if (champ === "type") return type;

    return typeof valeur === "string" && valeur.trim()
      ? valeur.trim()
      : null;
  });

  const sql = `
    INSERT INTO fournisseurs (${champs.join(", ")})
    VALUES (${champs.map(() => "?").join(", ")})
  `;

  db.query(sql, valeurs, (erreur, resultat) => {
    if (erreur) {
      console.log("Erreur ajout fournisseur :", erreur);

      return res.status(500).json({
        message: "Erreur lors de l'ajout du fournisseur",
      });
    }

    res.status(201).json({
      message: "Fournisseur ajouté avec succès",
      id: resultat.insertId,
    });
  });
});

// Modifier un fournisseur
app.put("/fournisseurs/:id", (req, res) => {
  const id = Number(req.params.id);
  const donnees = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Identifiant fournisseur invalide",
    });
  }

  if (
    typeof donnees.nom !== "string" ||
    !donnees.nom.trim()
  ) {
    return res.status(400).json({
      message: "Le nom du fournisseur est obligatoire",
    });
  }

  if (
    typeof donnees.telephone !== "string" ||
    !donnees.telephone.trim()
  ) {
    return res.status(400).json({
      message: "Le numéro de téléphone est obligatoire",
    });
  }

  const type = donnees.type || "entreprise";

  if (!["entreprise", "particulier"].includes(type)) {
    return res.status(400).json({
      message: "Type de fournisseur invalide",
    });
  }

  const champs = [
    "nom",
    "telephone",
    "email",
    "adresse",
    "ville",
    "notes",
    "type",
    "raison_sociale",
    "nom_commercial",
    "forme_juridique",
    "rc",
    "nif",
    "nis",
    "article_fiscal",
    "telephone_secondaire",
    "site_web",
    "wilaya",
    "code_postal",
    "pays",
    "contact_nom",
    "contact_fonction",
    "contact_telephone",
    "contact_email",
    "mode_paiement",
    "delai_paiement",
    "banque",
    "rib",
  ];

  const valeurs = champs.map((champ) => {
    const valeur = donnees[champ];

    if (champ === "type") return type;

    return typeof valeur === "string" && valeur.trim()
      ? valeur.trim()
      : null;
  });

  const modifications = champs
    .map((champ) => `${champ} = ?`)
    .join(", ");

  const sql = `
    UPDATE fournisseurs
    SET ${modifications}
    WHERE id = ?
  `;

  db.query(sql, [...valeurs, id], (erreur, resultat) => {
    if (erreur) {
      console.log("Erreur modification fournisseur :", erreur);

      return res.status(500).json({
        message: "Erreur lors de la modification du fournisseur",
      });
    }

    if (resultat.affectedRows === 0) {
      return res.status(404).json({
        message: "Fournisseur introuvable",
      });
    }

    res.json({
      message: "Fournisseur modifié avec succès",
    });
  });
});

// Activer ou désactiver un fournisseur
app.patch("/fournisseurs/:id/statut", (req, res) => {
  const id = Number(req.params.id);
  const { actif } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Identifiant fournisseur invalide",
    });
  }

  if (typeof actif !== "boolean") {
    return res.status(400).json({
      message: "Le statut doit être true ou false",
    });
  }

  const sql = `
    UPDATE fournisseurs
    SET actif = ?
    WHERE id = ?
  `;

  db.query(sql, [actif ? 1 : 0, id], (erreur, resultat) => {
    if (erreur) {
      console.log("Erreur changement statut fournisseur :", erreur);

      return res.status(500).json({
        message: "Erreur lors du changement de statut",
      });
    }

    if (resultat.affectedRows === 0) {
      return res.status(404).json({
        message: "Fournisseur introuvable",
      });
    }

    res.json({
      message: actif
        ? "Fournisseur réactivé avec succès"
        : "Fournisseur désactivé avec succès",
    });
  });
});

// ==================================
// DEMARRAGE DU SERVEUR
// ==================================

app.listen(5000, () => {
  console.log("Serveur StockPro démarré sur le port 5000");
});
