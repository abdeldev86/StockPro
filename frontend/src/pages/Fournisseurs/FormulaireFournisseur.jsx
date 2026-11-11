
import { useState } from "react";

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

function FormulaireFournisseur({
  fournisseurInitial,
  onEnregistrer,
  onAnnuler,
  titre = "Informations du fournisseur",
  texteBouton = "Enregistrer le fournisseur",
}) {
  const [formulaire, setFormulaire] = useState({
    ...fournisseurVide,
    ...(fournisseurInitial || {}),
  });

  function modifierChamp(e) {
    const { name, value } = e.target;

    setFormulaire((ancien) => ({
      ...ancien,
      [name]: value,
    }));
  }

  function soumettreFormulaire(e) {
    e.preventDefault();

    if (!formulaire.nom.trim()) {
      alert("Veuillez saisir le nom du fournisseur.");
      return;
    }

    if (!formulaire.telephone.trim()) {
      alert("Veuillez saisir le numéro de téléphone.");
      return;
    }

    onEnregistrer(formulaire);
  }

  const styleSection = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  };

  const styleGrille = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
  };

  const styleChamp = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const styleInput = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
    boxSizing: "border-box",
  };

  function champ(label, name, type = "text", obligatoire = false) {
    return (
      <div style={styleChamp} key={name}>
        <label htmlFor={name}>
          {label} {obligatoire && <span style={{ color: "red" }}>*</span>}
        </label>

        <input
          id={name}
          name={name}
          type={type}
          value={formulaire[name] || ""}
          onChange={modifierChamp}
          required={obligatoire}
          style={styleInput}
        />
      </div>
    );
  }

  function selection(label, name, options) {
    return (
      <div style={styleChamp} key={name}>
        <label htmlFor={name}>{label}</label>

        <select
          id={name}
          name={name}
          value={formulaire[name] || ""}
          onChange={modifierChamp}
          style={styleInput}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <form onSubmit={soumettreFormulaire}>
      <h2>{titre}</h2>

      <p>
        Les champs marqués d'une étoile (*) sont obligatoires.
      </p>

      {/* IDENTITÉ */}
      <section style={styleSection}>
        <h3>1. Identité du fournisseur</h3>

        <div style={styleGrille}>
          {selection("Type de fournisseur", "type", [
            { value: "entreprise", label: "Entreprise" },
            { value: "particulier", label: "Particulier" },
          ])}

          {champ("Nom du fournisseur", "nom", "text", true)}

          {champ("Raison sociale", "raison_sociale")}

          {champ("Nom commercial", "nom_commercial")}

          {selection("Forme juridique", "forme_juridique", [
            { value: "", label: "Choisir..." },
            { value: "EURL", label: "EURL" },
            { value: "SARL", label: "SARL" },
            { value: "SPA", label: "SPA" },
            { value: "SNC", label: "SNC" },
            { value: "Entreprise individuelle", label: "Entreprise individuelle" },
            { value: "Autre", label: "Autre" },
          ])}
        </div>
      </section>

      {/* INFORMATIONS ADMINISTRATIVES */}
      <section style={styleSection}>
        <h3>2. Informations administratives</h3>

        <div style={styleGrille}>
          {champ("Registre de commerce (RC)", "rc")}

          {champ("Numéro d'identification fiscale (NIF)", "nif")}

          {champ("Numéro d'identification statistique (NIS)", "nis")}

          {champ("Article d'imposition / fiscal", "article_fiscal")}
        </div>
      </section>

      {/* COORDONNÉES */}
      <section style={styleSection}>
        <h3>3. Coordonnées</h3>

        <div style={styleGrille}>
          {champ("Téléphone principal", "telephone", "tel", true)}

          {champ("Téléphone secondaire", "telephone_secondaire", "tel")}

          {champ("Adresse e-mail", "email", "email")}

          {champ("Site web", "site_web", "url")}

          {champ("Adresse", "adresse")}

          {champ("Ville", "ville")}

          {champ("Wilaya", "wilaya")}

          {champ("Code postal", "code_postal")}

          {champ("Pays", "pays")}
        </div>
      </section>

      {/* CONTACT */}
      <section style={styleSection}>
        <h3>4. Personne à contacter</h3>

        <div style={styleGrille}>
          {champ("Nom du contact", "contact_nom")}

          {champ("Fonction", "contact_fonction")}

          {champ("Téléphone du contact", "contact_telephone", "tel")}

          {champ("E-mail du contact", "contact_email", "email")}
        </div>
      </section>

      {/* PAIEMENT */}
      <section style={styleSection}>
        <h3>5. Conditions de paiement</h3>

        <div style={styleGrille}>
          {selection("Mode de paiement préféré", "mode_paiement", [
            { value: "", label: "Choisir..." },
            { value: "Espèces", label: "Espèces" },
            { value: "Virement bancaire", label: "Virement bancaire" },
            { value: "Chèque", label: "Chèque" },
            { value: "Carte bancaire", label: "Carte bancaire" },
            { value: "Autre", label: "Autre" },
          ])}

          {selection("Délai de paiement habituel", "delai_paiement", [
            { value: "", label: "Choisir..." },
            { value: "Comptant", label: "Comptant" },
            { value: "7 jours", label: "7 jours" },
            { value: "15 jours", label: "15 jours" },
            { value: "30 jours", label: "30 jours" },
            { value: "60 jours", label: "60 jours" },
            { value: "90 jours", label: "90 jours" },
          ])}

          {champ("Nom de la banque", "banque")}

          {champ("RIB / Numéro de compte bancaire", "rib")}
        </div>
      </section>

      {/* NOTES */}
      <section style={styleSection}>
        <h3>6. Notes complémentaires</h3>

        <div style={styleChamp}>
          <label htmlFor="notes">Observations</label>

          <textarea
            id="notes"
            name="notes"
            value={formulaire.notes || ""}
            onChange={modifierChamp}
            rows="4"
            style={styleInput}
          />
        </div>
      </section>

      {/* BOUTONS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button type="submit">
          {texteBouton}
        </button>

        <button type="button" onClick={onAnnuler}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default FormulaireFournisseur;
