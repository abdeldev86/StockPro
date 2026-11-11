
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormulaireFournisseur from "./FormulaireFournisseur";

const CLE_FOURNISSEURS = "stockpro-fournisseurs";

const fournisseurVide = {
  type: "entreprise",
  nom: "",
  raison_sociale: "",
  nom_commercial: "",
  forme_juridique: "",
  rc: "",
  nif: "",
  nis: "",
  article_fiscal: "",
  telephone: "",
  telephone_secondaire: "",
  email: "",
  site_web: "",
  adresse: "",
  ville: "",
  wilaya: "",
  code_postal: "",
  pays: "Algérie",
  contact_nom: "",
  contact_fonction: "",
  contact_telephone: "",
  contact_email: "",
  mode_paiement: "",
  delai_paiement: "",
  banque: "",
  rib: "",
  notes: "",
};

function lireFournisseurs() {
  try {
    const donnees = JSON.parse(
      localStorage.getItem(CLE_FOURNISSEURS) || "[]"
    );

    return Array.isArray(donnees) ? donnees : [];
  } catch (erreur) {
    console.error("Erreur de lecture des fournisseurs :", erreur);
    return [];
  }
}

function FicheFournisseur() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fournisseurs, setFournisseurs] = useState(lireFournisseurs);

  const fournisseurTrouve = fournisseurs.find(
    (fournisseur) => String(fournisseur.id) === id
  );

  const [modeModification, setModeModification] = useState(false);

  function enregistrerModification(donnees) {
    const fournisseurModifie = {
      ...fournisseurTrouve,
      ...donnees,
    };

    const nouvelleListe = fournisseurs.map((fournisseur) =>
      String(fournisseur.id) === id
        ? fournisseurModifie
        : fournisseur
    );

    try {
      localStorage.setItem(
        CLE_FOURNISSEURS,
        JSON.stringify(nouvelleListe)
      );

      setFournisseurs(nouvelleListe);
      setModeModification(false);
    } catch (erreur) {
      console.error("Erreur de modification :", erreur);
      alert("Impossible de modifier le fournisseur.");
    }
  }

  function changerStatut() {
    const nouveauStatut = fournisseurTrouve.actif === false;

    const listeModifiee = fournisseurs.map((fournisseur) =>
      String(fournisseur.id) === id
        ? { ...fournisseur, actif: nouveauStatut }
        : fournisseur
    );

    try {
      localStorage.setItem(
        CLE_FOURNISSEURS,
        JSON.stringify(listeModifiee)
      );

      setFournisseurs(listeModifiee);
    } catch (erreur) {
      console.error("Erreur de changement de statut :", erreur);
      alert("Impossible de modifier le statut.");
    }
  }

  function afficherValeur(valeur) {
    if (valeur === null || valeur === undefined || valeur === "") {
      return "Non renseigné";
    }

    return valeur;
  }

  function ligne(label, valeur) {
    return (
      <div
        key={label}
        style={{
          padding: "12px 0",
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ color: "#777", fontSize: "13px" }}>
          {label}
        </div>

        <div style={{ marginTop: "5px", fontWeight: "500" }}>
          {afficherValeur(valeur)}
        </div>
      </div>
    );
  }

  function section(titre, contenu) {
    return (
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{titre}</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            columnGap: "25px",
          }}
        >
          {contenu}
        </div>
      </section>
    );
  }

  if (!fournisseurTrouve) {
    return (
      <div className="page">
        <h1>Fournisseur introuvable</h1>

        <p>
          Ce fournisseur n'existe pas ou a été supprimé.
        </p>

        <button onClick={() => navigate("/fournisseurs")}>
          Retour à la liste
        </button>
      </div>
    );
  }

  const fournisseur = {
    ...fournisseurVide,
    ...fournisseurTrouve,
  };

  const estActif = fournisseur.actif !== false;

  return (
    <div className="page">
      {modeModification ? (
        <>
          <h1>Modifier le fournisseur</h1>

          <FormulaireFournisseur
            fournisseurInitial={fournisseur}
            onEnregistrer={enregistrerModification}
            onAnnuler={() => setModeModification(false)}
            titre="Modifier les informations"
            texteBouton="Enregistrer les modifications"
          />
        </>
      ) : (
        <>
          {/* EN-TÊTE */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
              marginBottom: "25px",
            }}
          >
            <div>
              <h1>{fournisseur.nom}</h1>

              <span
                style={{
                  display: "inline-block",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: estActif ? "#d9f5e2" : "#eee",
                  color: estActif ? "#16743a" : "#666",
                  fontSize: "13px",
                }}
              >
                {estActif ? "Fournisseur actif" : "Fournisseur inactif"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/fournisseurs")}>
                Retour
              </button>

              <button onClick={() => setModeModification(true)}>
                Modifier
              </button>

              <button
                onClick={changerStatut}
                style={{
                  background: estActif ? "#b83232" : "#21834a",
                  color: "white",
                }}
              >
                {estActif ? "Désactiver" : "Réactiver"}
              </button>
            </div>
          </div>

          {/* IDENTITÉ */}
          {section("1. Identité du fournisseur", [
            ligne("Type", fournisseur.type),
            ligne("Nom", fournisseur.nom),
            ligne("Raison sociale", fournisseur.raison_sociale),
            ligne("Nom commercial", fournisseur.nom_commercial),
            ligne("Forme juridique", fournisseur.forme_juridique),
          ])}

          {/* ADMINISTRATIF */}
          {section("2. Informations administratives", [
            ligne("Registre de commerce (RC)", fournisseur.rc),
            ligne("NIF", fournisseur.nif),
            ligne("NIS", fournisseur.nis),
            ligne("Article fiscal", fournisseur.article_fiscal),
          ])}

          {/* COORDONNÉES */}
          {section("3. Coordonnées", [
            ligne("Téléphone principal", fournisseur.telephone),
            ligne("Téléphone secondaire", fournisseur.telephone_secondaire),
            ligne("E-mail", fournisseur.email),
            ligne("Site web", fournisseur.site_web),
            ligne("Adresse", fournisseur.adresse),
            ligne("Ville", fournisseur.ville),
            ligne("Wilaya", fournisseur.wilaya),
            ligne("Code postal", fournisseur.code_postal),
            ligne("Pays", fournisseur.pays),
          ])}

          {/* CONTACT */}
          {section("4. Personne à contacter", [
            ligne("Nom du contact", fournisseur.contact_nom),
            ligne("Fonction", fournisseur.contact_fonction),
            ligne("Téléphone", fournisseur.contact_telephone),
            ligne("E-mail", fournisseur.contact_email),
          ])}

          {/* PAIEMENT */}
          {section("5. Conditions de paiement", [
            ligne("Mode de paiement préféré", fournisseur.mode_paiement),
            ligne("Délai habituel", fournisseur.delai_paiement),
            ligne("Banque", fournisseur.banque),
            ligne("RIB", fournisseur.rib),
          ])}

          {/* NOTES */}
          {section("6. Notes complémentaires", [
            ligne("Observations", fournisseur.notes),
            ligne(
              "Date de création",
              fournisseur.date_creation
                ? new Date(fournisseur.date_creation).toLocaleDateString("fr-FR")
                : "Non renseignée"
            ),
          ])}

          {/* HISTORIQUE DES ACHATS */}
          <section
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>7. Historique des achats</h3>

            <p>
              L'historique des achats sera connecté au module Achats
              lorsque nous développerons cette fonctionnalité.
            </p>

            <p style={{ color: "#777" }}>
              Aucun historique disponible pour le moment.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

export default FicheFournisseur;
