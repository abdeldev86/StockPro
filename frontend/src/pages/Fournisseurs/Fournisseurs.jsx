
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/fournisseurs";
const CLE_COLONNES = "stockpro-colonnes-fournisseurs";

const colonnesDefaut = {
  nom: true,
  type: true,
  raison_sociale: false,
  nom_commercial: false,
  forme_juridique: false,
  rc: true,
  nif: true,
  nis: false,
  article_fiscal: false,
  telephone: true,
  telephone_secondaire: false,
  email: false,
  site_web: false,
  adresse: false,
  ville: true,
  wilaya: false,
  code_postal: false,
  pays: false,
  contact_nom: false,
  contact_fonction: false,
  contact_telephone: false,
  contact_email: false,
  mode_paiement: false,
  delai_paiement: false,
  banque: false,
  rib: false,
  notes: false,
  statut: true,
  date_creation: false,
};

const listeColonnes = [
  { id: "nom", label: "Nom du fournisseur" },
  { id: "type", label: "Type de fournisseur" },
  { id: "raison_sociale", label: "Raison sociale" },
  { id: "nom_commercial", label: "Nom commercial" },
  { id: "forme_juridique", label: "Forme juridique" },
  { id: "rc", label: "Registre de commerce (RC)" },
  { id: "nif", label: "NIF" },
  { id: "nis", label: "NIS" },
  { id: "article_fiscal", label: "Article fiscal" },
  { id: "telephone", label: "Téléphone principal" },
  { id: "telephone_secondaire", label: "Téléphone secondaire" },
  { id: "email", label: "Email" },
  { id: "site_web", label: "Site web" },
  { id: "adresse", label: "Adresse" },
  { id: "ville", label: "Ville" },
  { id: "wilaya", label: "Wilaya" },
  { id: "code_postal", label: "Code postal" },
  { id: "pays", label: "Pays" },
  { id: "contact_nom", label: "Nom du responsable" },
  { id: "contact_fonction", label: "Fonction du responsable" },
  { id: "contact_telephone", label: "Téléphone du contact" },
  { id: "contact_email", label: "Email du contact" },
  { id: "mode_paiement", label: "Mode de paiement préféré" },
  { id: "delai_paiement", label: "Délai de paiement" },
  { id: "banque", label: "Banque" },
  { id: "rib", label: "RIB" },
  { id: "notes", label: "Notes" },
  { id: "statut", label: "Statut" },
  { id: "date_creation", label: "Date de création" },
];

function Fournisseurs() {
  const navigate = useNavigate();

  const [fournisseurs, setFournisseurs] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [colonnes, setColonnes] = useState(colonnesDefaut);
  const [afficherColonnes, setAfficherColonnes] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Charger les fournisseurs depuis MySQL via le backend
  useEffect(() => {
    async function chargerFournisseurs() {
      try {
        const reponse = await fetch(API_URL);

        if (!reponse.ok) {
          throw new Error("Erreur lors du chargement des fournisseurs.");
        }

        const donnees = await reponse.json();

        setFournisseurs(Array.isArray(donnees) ? donnees : []);
        setErreur("");
      } catch (err) {
        console.error("Erreur fournisseurs :", err);
        setErreur("Impossible de charger les fournisseurs.");
      } finally {
        setChargement(false);
      }
    }

    chargerFournisseurs();
  }, []);

  // Charger les préférences des colonnes
  useEffect(() => {
    try {
      const donnees = localStorage.getItem(CLE_COLONNES);

      if (donnees) {
        const preferences = JSON.parse(donnees);

        setColonnes({
          ...colonnesDefaut,
          ...preferences,
        });
      }
    } catch (err) {
      console.error("Erreur de chargement des colonnes :", err);
    }
  }, []);

  // Modifier une colonne visible
  function modifierColonne(id) {
    setColonnes((anciennes) => {
      const nouvelles = {
        ...anciennes,
        [id]: !anciennes[id],
      };

      localStorage.setItem(
        CLE_COLONNES,
        JSON.stringify(nouvelles)
      );

      return nouvelles;
    });
  }

  // Réinitialiser les colonnes
  function reinitialiserColonnes() {
    setColonnes(colonnesDefaut);

    localStorage.setItem(
      CLE_COLONNES,
      JSON.stringify(colonnesDefaut)
    );
  }

  // Déterminer si un fournisseur est actif
  function estActif(fournisseur) {
    return Number(fournisseur.actif) === 1;
  }

  // Filtrer et rechercher les fournisseurs
  const fournisseursFiltres = fournisseurs.filter((fournisseur) => {
    const rechercheMinuscule = recherche.toLowerCase().trim();

    const correspondRecherche = [
      fournisseur.nom,
      fournisseur.raison_sociale,
      fournisseur.nom_commercial,
      fournisseur.rc,
      fournisseur.nif,
      fournisseur.telephone,
      fournisseur.email,
      fournisseur.ville,
    ].some((valeur) =>
      String(valeur || "")
        .toLowerCase()
        .includes(rechercheMinuscule)
    );

    const correspondStatut =
      filtreStatut === "tous" ||
      (filtreStatut === "actifs" && estActif(fournisseur)) ||
      (filtreStatut === "inactifs" && !estActif(fournisseur));

    return correspondRecherche && correspondStatut;
  });

  // Afficher le contenu d'une cellule
  function afficherCellule(fournisseur, colonne) {
    if (colonne === "type") {
      return fournisseur.type === "particulier"
        ? "Particulier"
        : "Entreprise";
    }

    if (colonne === "statut") {
      return estActif(fournisseur) ? "Actif" : "Inactif";
    }

    if (colonne === "date_creation") {
      return fournisseur.date_creation
        ? new Date(fournisseur.date_creation).toLocaleDateString("fr-FR")
        : "-";
    }

    return fournisseur[colonne] || "-";
  }

  // Ouvrir la fiche fournisseur
  function ouvrirFiche(id) {
    navigate(`/fournisseurs/${id}`);
  }

  const nombreActifs = fournisseurs.filter(estActif).length;
  const nombreInactifs = fournisseurs.length - nombreActifs;

  return (
    <section className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2>Gestion des fournisseurs</h2>
          <p>
            Consultez et gérez les fournisseurs de votre entreprise.
          </p>
        </div>

        <Link
          to="/fournisseurs/nouveau"
          style={{
            display: "inline-block",
            padding: "11px 18px",
            backgroundColor: "#5b55e7",
            color: "white",
            borderRadius: "7px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          + Ajouter un fournisseur
        </Link>
      </div>

      {erreur && (
        <p style={{ color: "red" }}>{erreur}</p>
      )}

      {/* Résumé */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div className="form-section">
          <p>Total fournisseurs</p>
          <h2>{fournisseurs.length}</h2>
        </div>

        <div className="form-section">
          <p>Fournisseurs actifs</p>
          <h2>{nombreActifs}</h2>
        </div>

        <div className="form-section">
          <p>Fournisseurs inactifs</p>
          <h2>{nombreInactifs}</h2>
        </div>
      </div>

      {/* Liste */}
      <div className="form-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <h3>Liste des fournisseurs</h3>

          <button
            type="button"
            onClick={() => setAfficherColonnes(!afficherColonnes)}
          >
            Colonnes ⚙
          </button>
        </div>

        {/* Recherche et filtres */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, RC, téléphone..."
            style={{
              flex: "1",
              minWidth: "220px",
              padding: "10px",
            }}
          />

          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            style={{ padding: "10px", minWidth: "160px" }}
          >
            <option value="tous">Tous les fournisseurs</option>
            <option value="actifs">Actifs uniquement</option>
            <option value="inactifs">Inactifs uniquement</option>
          </select>
        </div>

        {/* Choix des colonnes */}
        {afficherColonnes && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h4>Choisir les colonnes visibles</h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginBottom: "15px",
              }}
            >
              {listeColonnes.map((colonne) => (
                <label
                  key={colonne.id}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(colonnes[colonne.id])}
                    onChange={() => modifierColonne(colonne.id)}
                  />
                  {colonne.label}
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={reinitialiserColonnes}
            >
              Réinitialiser les colonnes
            </button>
          </div>
        )}

        {/* Tableau */}
        {chargement ? (
          <p>Chargement des fournisseurs...</p>
        ) : erreur ? (
          <p>La liste des fournisseurs n'a pas pu être chargée.</p>
        ) : fournisseursFiltres.length === 0 ? (
          <p>
            {fournisseurs.length === 0
              ? "Aucun fournisseur enregistré."
              : "Aucun fournisseur ne correspond à votre recherche."}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  {listeColonnes
                    .filter((colonne) => colonnes[colonne.id])
                    .map((colonne) => (
                      <th key={colonne.id}>
                        {colonne.label}
                      </th>
                    ))}

                  <th>Consulter</th>
                </tr>
              </thead>

              <tbody>
                {fournisseursFiltres.map((fournisseur) => (
                  <tr
                    key={fournisseur.id}
                    onClick={() => ouvrirFiche(fournisseur.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        ouvrirFiche(fournisseur.id);
                      }
                    }}
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  >
                    {listeColonnes
                      .filter((colonne) => colonnes[colonne.id])
                      .map((colonne) => (
                        <td key={colonne.id}>
                          {colonne.id === "statut" ? (
                            <span
                              style={{
                                color: estActif(fournisseur)
                                  ? "green"
                                  : "#888",
                                fontWeight: "600",
                              }}
                            >
                              {afficherCellule(fournisseur, colonne.id)}
                            </span>
                          ) : (
                            afficherCellule(fournisseur, colonne.id)
                          )}
                        </td>
                      ))}

                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          ouvrirFiche(fournisseur.id);
                        }}
                      >
                        Voir la fiche
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ marginTop: "15px", color: "#777" }}>
          {fournisseursFiltres.length} fournisseur(s) affiché(s)
        </p>
      </div>
    </section>
  );
}

export default Fournisseurs;
