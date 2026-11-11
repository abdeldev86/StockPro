
import { useState, useEffect } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const [categorieModifiee, setCategorieModifiee] = useState(null);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);

  const API = "http://localhost:5000/categories";

  // Récupérer les catégories depuis MySQL
  function chargerCategories() {
    setChargement(true);

    fetch(API)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Impossible de récupérer les catégories.");
        }
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        setErreur(err.message);
      })
      .finally(() => {
        setChargement(false);
      });
  }

  useEffect(() => {
    chargerCategories();
  }, []);

  // Vider le formulaire
  function viderFormulaire() {
    setNom("");
    setDescription("");
    setCategorieModifiee(null);
  }

  // Ajouter ou modifier une catégorie
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
        headers: {
          "Content-Type": "application/json",
        },
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

      viderFormulaire();
      chargerCategories();
    } catch (err) {
      setErreur(err.message);
    }
  }

  // Préparer la modification
  function modifierCategorie(categorie) {
    setCategorieModifiee(categorie.id);
    setNom(categorie.nom);
    setDescription(categorie.description || "");
    setErreur("");
    setMessage("");
  }

  // Supprimer une catégorie
  async function supprimerCategorie(id) {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette catégorie ?"
    );

    if (!confirmation) return;

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const resultat = await response.json();

      if (!response.ok) {
        throw new Error(resultat.message || "Impossible de supprimer cette catégorie.");
      }

      setMessage("Catégorie supprimée avec succès.");
      chargerCategories();

      if (categorieModifiee === id) {
        viderFormulaire();
      }
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <section className="page">
      <h2>Gestion des catégories</h2>

      <p>Ajoutez, modifiez et gérez les catégories de vos produits.</p>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Formulaire */}
      <div className="form-section">
        <h3>
          {categorieModifiee ? "Modifier une catégorie" : "Nouvelle catégorie"}
        </h3>

        <form onSubmit={enregistrerCategorie}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom de la catégorie *</label>

              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex : Informatique"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la catégorie"
              />
            </div>
          </div>

          <div className="form-actions">
            {categorieModifiee && (
              <button
                type="button"
                className="btn-cancel"
                onClick={viderFormulaire}
              >
                Annuler
              </button>
            )}

            <button type="submit" className="btn-save">
              {categorieModifiee ? "Enregistrer les modifications" : "Ajouter la catégorie"}
            </button>
          </div>
        </form>
      </div>

      {/* Tableau des catégories */}
      <div className="form-section" style={{ marginTop: "25px" }}>
        <h3>Liste des catégories ({categories.length})</h3>

        {chargement ? (
          <p>Chargement des catégories...</p>
        ) : categories.length === 0 ? (
          <p>Aucune catégorie enregistrée.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((categorie) => (
                  <tr key={categorie.id}>
                    <td>{categorie.id}</td>
                    <td>{categorie.nom}</td>
                    <td>{categorie.description || "-"}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => modifierCategorie(categorie)}
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => supprimerCategorie(categorie.id)}
                        style={{ marginLeft: "8px" }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
