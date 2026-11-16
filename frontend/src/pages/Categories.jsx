
import { useState, useEffect } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const [categorieModifiee, setCategorieModifiee] = useState(null);
  const [fenetreOuverte, setFenetreOuverte] = useState(false);

  const [recherche, setRecherche] = useState("");

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);

  const API = "http://localhost:5000/categories";

  // ==================================
  // CHARGER LES CATEGORIES
  // ==================================

  function chargerCategories() {
    setChargement(true);

    fetch(API)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Impossible de récupérer les catégories.");
        }

        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => setErreur(err.message))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerCategories();
  }, []);

  // ==================================
  // OUVRIR ET FERMER LA FENETRE
  // ==================================

  function ouvrirAjout() {
    viderFormulaire();
    setErreur("");
    setMessage("");
    setFenetreOuverte(true);
  }

  function fermerFenetre() {
    viderFormulaire();
    setErreur("");
    setFenetreOuverte(false);
  }

  // ==================================
  // VIDER LE FORMULAIRE
  // ==================================

  function viderFormulaire() {
    setNom("");
    setDescription("");
    setCategorieModifiee(null);
  }

  // ==================================
  // AJOUTER OU MODIFIER UNE CATEGORIE
  // ==================================

  async function enregistrerCategorie(e) {
    e.preventDefault();
    setErreur("");
    setMessage("");

    if (!nom.trim()) {
      setErreur("Veuillez saisir le nom de la catégorie.");
      return;
    }

    const donnees = {
      nom: nom.trim(),
      description: description.trim(),
    };

    try {
      const url = categorieModifiee
        ? `${API}/${categorieModifiee}`
        : API;

      const methode = categorieModifiee ? "PUT" : "POST";

      const response = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      });

      const resultat = await response.json();

      if (!response.ok) {
        throw new Error(resultat.message || "Une erreur est survenue.");
      }

      setMessage(
        categorieModifiee
          ? "Catégorie modifiée avec succès."
          : "Catégorie ajoutée avec succès."
      );

      fermerFenetre();
      chargerCategories();
    } catch (err) {
      setErreur(err.message);
    }
  }

  // ==================================
  // MODIFIER UNE CATEGORIE
  // ==================================

  function modifierCategorie(categorie) {
    setCategorieModifiee(categorie.id);
    setNom(categorie.nom);
    setDescription(categorie.description || "");
    setErreur("");
    setMessage("");
    setFenetreOuverte(true);
  }

  // ==================================
  // ACTIVER OU DESACTIVER UNE CATEGORIE
  // ==================================

  async function changerStatut(categorie) {
    const nouveauStatut =
      categorie.statut === "actif" ? "inactif" : "actif";

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${categorie.id}/statut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      const resultat = await response.json();

      if (!response.ok) {
        throw new Error(
          resultat.message || "Impossible de modifier le statut."
        );
      }

      setMessage("Statut modifié avec succès.");
      chargerCategories();
    } catch (err) {
      setErreur(err.message);
    }
  }

  // ==================================
  // COMPTER LES CATEGORIES ACTIVES
  // ET INACTIVES
  // ==================================

  const nombreActives = categories.filter(
    (categorie) => categorie.statut === "actif"
  ).length;

  const nombreInactives = categories.filter(
    (categorie) => categorie.statut === "inactif"
  ).length;

  // ==================================
  // RECHERCHE PAR ID, NOM OU DESCRIPTION
  // ==================================

  const categoriesFiltrees = categories.filter((categorie) => {
    const terme = recherche.trim().toLowerCase();

    return (
      String(categorie.id).includes(terme) ||
      categorie.nom.toLowerCase().includes(terme) ||
      (categorie.description || "").toLowerCase().includes(terme)
    );
  });

  // ==================================
  // AFFICHAGE
  // ==================================

  return (
    <section className="page">
      <h2>Gestion des catégories</h2>

      <p>Ajoutez, modifiez et gérez les catégories de vos produits.</p>

      {/* COMPTEURS */}

      <p>
        Catégories actives : <strong>{nombreActives}</strong>
        {" | "}
        Catégories inactives : <strong>{nombreInactives}</strong>
      </p>

      {erreur && !fenetreOuverte && (
        <p style={{ color: "red" }}>{erreur}</p>
      )}

      {message && (
        <p style={{ color: "green" }}>{message}</p>
      )}

      {/* Bouton d'ajout */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "20px 0",
        }}
      >
        <button
          type="button"
          className="btn-save"
          onClick={ouvrirAjout}
        >
          + Ajouter une catégorie
        </button>
      </div>

      {/* Liste des catégories */}

      <div className="form-section">
        <h3>
          Liste des catégories ({categoriesFiltrees.length})
        </h3>

        {/* Champ de recherche */}

        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher par ID, nom ou description..."
          style={{
            width: "100%",
            maxWidth: "400px",
            marginBottom: "20px",
          }}
        />

        {chargement ? (
          <p>Chargement des catégories...</p>
        ) : categoriesFiltrees.length === 0 ? (
          <p>
            {recherche
              ? "Aucune catégorie ne correspond à votre recherche."
              : "Aucune catégorie enregistrée."}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categoriesFiltrees.map((categorie) => (
                  <tr key={categorie.id}>
                    <td>{categorie.id}</td>

                    <td>{categorie.nom}</td>

                    <td>{categorie.description || "-"}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => changerStatut(categorie)}
                        aria-label={
                          categorie.statut === "actif"
                            ? "Désactiver la catégorie"
                            : "Activer la catégorie"
                        }
                        title="Changer le statut"
                        style={{
                          width: "48px",
                          height: "26px",
                          borderRadius: "20px",
                          border: "none",
                          padding: "3px",
                          cursor: "pointer",
                          background:
                            categorie.statut === "actif"
                              ? "#238636"
                              : "#999",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            categorie.statut === "actif"
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <span
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "white",
                          }}
                        />
                      </button>

                      <small>
                        {categorie.statut === "actif"
                          ? "Actif"
                          : "Inactif"}
                      </small>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => modifierCategorie(categorie)}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FENETRE MODALE */}

      {fenetreOuverte && (
        <div
          onClick={fermerFenetre}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-fenetre-categorie"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "500px",
              padding: "28px",
              borderRadius: "12px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
              color: "#222",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
              }}
            >
              <h3
                id="titre-fenetre-categorie"
                style={{ margin: 0 }}
              >
                {categorieModifiee
                  ? "Modifier une catégorie"
                  : "Nouvelle catégorie"}
              </h3>

              <button
                type="button"
                onClick={fermerFenetre}
                aria-label="Fermer"
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "25px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {erreur && (
              <p style={{ color: "red", marginBottom: "15px" }}>
                {erreur}
              </p>
            )}

            <form onSubmit={enregistrerCategorie}>
              <div
                className="form-group"
                style={{ marginBottom: "18px" }}
              >
                <label>Nom de la catégorie *</label>

                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex : Informatique"
                  required
                  autoFocus
                  style={{ width: "100%" }}
                />
              </div>

              <div
                className="form-group"
                style={{ marginBottom: "25px" }}
              >
                <label>Description</label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la catégorie"
                  style={{ width: "100%" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={fermerFenetre}
                >
                  Annuler
                </button>

                <button type="submit" className="btn-save">
                  {categorieModifiee
                    ? "Enregistrer les modifications"
                    : "Ajouter la catégorie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Categories;
