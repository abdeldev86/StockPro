
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Colonnes disponibles
const colonnes = [
  { key: "id", label: "ID" },
  { key: "reference", label: "Référence" },
  { key: "code_barres", label: "Code-barres" },
  { key: "nom", label: "Nom de l'article" },
  { key: "categorie", label: "Catégorie" },
  { key: "marque", label: "Marque" },
  { key: "description", label: "Description" },
  { key: "prix_achat", label: "Prix d'achat" },
  { key: "prix", label: "Prix de vente" },
  { key: "quantite", label: "Quantité" },
  { key: "seuil_alerte", label: "Seuil d'alerte" },
  { key: "emplacement", label: "Emplacement" },
  { key: "image", label: "Image" },
  { key: "date_ajout", label: "Date d'ajout" },
  { key: "date_modification", label: "Date de modification" },
  { key: "etat", label: "État du stock" },
];

// Affichage par défaut
const affichageDefaut = [
  "reference",
  "nom",
  "categorie",
  "prix_achat",
  "prix",
  "quantite",
  "etat",
];

function Stock() {
  const [articles, setArticles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [colonnesVisibles, setColonnesVisibles] = useState(() => {
    try {
      const preferences = localStorage.getItem("stockpro-colonnes-stock");
      return preferences ? JSON.parse(preferences) : affichageDefaut;
    } catch {
      return affichageDefaut;
    }
  });

  const [menuColonnes, setMenuColonnes] = useState(false);

  // Récupération des articles
  useEffect(() => {
    fetch("http://localhost:5000/produits")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Impossible de récupérer les articles.");
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data);
        setErreur("");
      })
      .catch((erreur) => {
        console.error("Erreur stock :", erreur);
        setErreur("Impossible de charger le stock.");
      })
      .finally(() => setChargement(false));
  }, []);

  // Sauvegarde temporaire des préférences dans le navigateur
  useEffect(() => {
    localStorage.setItem(
      "stockpro-colonnes-stock",
      JSON.stringify(colonnesVisibles)
    );
  }, [colonnesVisibles]);

  // Afficher ou masquer une colonne
  function changerColonne(key) {
    setColonnesVisibles((anciennes) =>
      anciennes.includes(key)
        ? anciennes.filter((colonne) => colonne !== key)
        : [...anciennes, key]
    );
  }

  // Afficher toutes les colonnes
  function toutAfficher() {
    setColonnesVisibles(colonnes.map((colonne) => colonne.key));
  }

  // Réinitialiser l'affichage
  function reinitialiser() {
    setColonnesVisibles(affichageDefaut);
  }

  // Formater les prix
  function formaterPrix(prix) {
    return `${Number(prix || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} DA`;
  }

  // Afficher le contenu d'une cellule
  function afficherCellule(article, key) {
    switch (key) {
      case "id":
        return article.id;

      case "reference":
        return article.reference || "-";

      case "code_barres":
        return article.code_barres || "-";

      case "nom":
        return article.nom;

      case "categorie":
        return article.categorie || "-";

      case "marque":
        return article.marque || "-";

      case "description":
        return article.description || "-";

      case "prix_achat":
        return formaterPrix(
          article.dernier_prix_achat ?? article.prix_achat
        );

      case "prix":
        return formaterPrix(article.prix);

      case "quantite":
        return article.quantite;

      case "seuil_alerte":
        return article.seuil_alerte ?? 5;

      case "emplacement":
        return article.emplacement || "-";

      case "image":
        return article.image ? (
          <img
            src={article.image}
            alt={article.nom}
            width="45"
            height="45"
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />
        ) : (
          "-"
        );

      case "date_ajout":
        return article.date_ajout
          ? new Date(article.date_ajout).toLocaleDateString("fr-FR")
          : "-";

      case "date_modification":
        return article.date_modification
          ? new Date(article.date_modification).toLocaleDateString("fr-FR")
          : "-";

      case "etat": {
        const quantite = Number(article.quantite || 0);
        const seuil = Number(article.seuil_alerte ?? 5);

        return (
          <span
            className={`stock-badge ${
              quantite <= seuil ? "low-stock" : "in-stock"
            }`}
          >
            {quantite <= seuil ? "Stock faible" : "Disponible"}
          </span>
        );
      }

      default:
        return "-";
    }
  }

  const colonnesAffichees = colonnes.filter((colonne) =>
    colonnesVisibles.includes(colonne.key)
  );

  return (
    <section className="products-panel">
      <div className="panel-header">
        <div>
          <h2>Gestion du stock</h2>
          <p>Consultez et gérez tous les articles de votre inventaire.</p>
        </div>

        <div>
          <button
            type="button"
            className="add-button"
            onClick={() => setMenuColonnes(!menuColonnes)}
          >
            Colonnes ⚙
          </button>

          <Link to="/nouvel-article" className="add-button">
  + Nouvel article
</Link>
        </div>
      </div>

      {menuColonnes && (
        <div className="columns-menu">
          <h3>Personnaliser les colonnes</h3>

          <div className="columns-list">
            {colonnes.map((colonne) => (
              <label key={colonne.key}>
                <input
                  type="checkbox"
                  checked={colonnesVisibles.includes(colonne.key)}
                  onChange={() => changerColonne(colonne.key)}
                />
                {colonne.label}
              </label>
            ))}
          </div>

          <div className="columns-actions">
            <button type="button" onClick={toutAfficher}>
              Tout afficher
            </button>

            <button type="button" onClick={reinitialiser}>
              Réinitialiser
            </button>

            <button
              type="button"
              onClick={() => setMenuColonnes(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {colonnesAffichees.map((colonne) => (
                <th key={colonne.key}>{colonne.label.toUpperCase()}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {chargement ? (
              <tr>
                <td colSpan={Math.max(colonnesAffichees.length, 1)}>
                  Chargement du stock...
                </td>
              </tr>
            ) : erreur ? (
              <tr>
                <td colSpan={Math.max(colonnesAffichees.length, 1)}>
                  {erreur}
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={Math.max(colonnesAffichees.length, 1)}>
                  Aucun article enregistré.
                </td>
              </tr>
            ) : colonnesAffichees.length === 0 ? (
              <tr>
                <td colSpan="1">
                  Aucune colonne sélectionnée. Choisissez des colonnes.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  {colonnesAffichees.map((colonne) => (
                    <td key={colonne.key}>
                      {afficherCellule(article, colonne.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="panel-footer">
        {articles.length} articles enregistrés
        <span>{colonnesAffichees.length} colonnes visibles</span>
      </div>
    </section>
  );
}

export default Stock;
