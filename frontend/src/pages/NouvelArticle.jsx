
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function NouvelArticle() {
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);

  // Étapes de l'opération
  const [etape, setEtape] = useState(1);

  // Informations de l'achat
  const [achat, setAchat] = useState({
    fournisseur_id: "",
    numero_bon: "",
    numero_facture: "",
  });

  // Articles conservés temporairement
  const [articles, setArticles] = useState([]);

  // Informations du fournisseur choisi
  const fournisseurChoisi = fournisseurs.find(
    (f) => String(f.id) === String(achat.fournisseur_id)
  );

  const formulaireRef = useRef(null);

  // Charger les catégories et les fournisseurs
  useEffect(() => {
    // Catégories : récupération depuis l'API
    fetch("http://localhost:5000/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Impossible de récupérer les catégories.");
        }
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((erreur) =>
        console.error("Erreur catégories :", erreur)
      );

    // Fournisseurs : récupération depuis localStorage
    try {
      const donnees = localStorage.getItem("stockpro-fournisseurs");
      const liste = donnees ? JSON.parse(donnees) : [];

      setFournisseurs(liste);
    } catch (erreur) {
      console.error("Erreur fournisseurs :", erreur);
      setFournisseurs([]);
    }
  }, []);

  // Première étape : informations de l'achat
  function continuerAchat(e) {
    e.preventDefault();

    if (!achat.fournisseur_id) {
      alert("Veuillez choisir un fournisseur.");
      return;
    }

    setEtape(2);
  }

  // Récupérer les informations du formulaire article
  function lireArticle() {
    const formulaire = formulaireRef.current;
    const donnees = new FormData(formulaire);

    return {
      reference: donnees.get("reference"),
      code_barres: donnees.get("code_barres"),
      nom: donnees.get("nom"),
      marque: donnees.get("marque"),
      categorie_id: donnees.get("categorie_id"),
      description: donnees.get("description"),
      prix_achat: donnees.get("prix_achat"),
      prix: donnees.get("prix"),
      quantite: donnees.get("quantite"),
      seuil_alerte: donnees.get("seuil_alerte"),
      emplacement: donnees.get("emplacement"),
      image: donnees.get("image")?.name || "",
    };
  }

  // Ajouter un article et préparer le suivant
  function ajouterAutreArticle() {
    const formulaire = formulaireRef.current;

    if (!formulaire.reportValidity()) {
      return;
    }

    const nouvelArticle = lireArticle();

    setArticles((anciens) => [...anciens, nouvelArticle]);

    formulaire.reset();
  }

  // Terminer l'achat
  function terminerAchat() {
    const formulaire = formulaireRef.current;

    const nomArticle = formulaire.elements.nom.value.trim();

    let listeFinale = [...articles];

    // Ajouter le dernier article s'il est renseigné
    if (nomArticle !== "") {
      if (!formulaire.reportValidity()) {
        return;
      }

      listeFinale.push(lireArticle());
    }

    if (listeFinale.length === 0) {
      alert("Veuillez ajouter au moins un article.");
      return;
    }

    setArticles(listeFinale);
    setEtape(3);
  }

  return (
    <section className="form-page">

      {/* ÉTAPE 1 : INFORMATIONS DE L'ACHAT */}
      {etape === 1 && (
        <>
          <div className="form-title">
            <h2>Nouvel article</h2>
            <p>Commencer une nouvelle opération d'achat.</p>
          </div>

          <form className="product-form" onSubmit={continuerAchat}>

            <div className="form-section">
              <h3>Informations de l'achat</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>Fournisseur *</label>

                  <select
                    value={achat.fournisseur_id}
                    onChange={(e) =>
                      setAchat({
                        ...achat,
                        fournisseur_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Choisir un fournisseur</option>

                    {fournisseurs.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nom}
                      </option>
                    ))}
                  </select>

                  <Link to="/fournisseurs" className="btn-inline">
                    + Ajouter un fournisseur
                  </Link>
                </div>

                <div className="form-group">
                  <label>Numéro du bon d'achat *</label>

                  <input
                    type="text"
                    value={achat.numero_bon}
                    onChange={(e) =>
                      setAchat({
                        ...achat,
                        numero_bon: e.target.value,
                      })
                    }
                    placeholder="Ex : BA-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de facture</label>

                  <input
                    type="text"
                    value={achat.numero_facture}
                    onChange={(e) =>
                      setAchat({
                        ...achat,
                        numero_facture: e.target.value,
                      })
                    }
                    placeholder="Ex : FAC-001"
                  />
                </div>

              </div>
            </div>

            <div className="form-actions">
              <Link to="/stock" className="btn-cancel">
                Annuler
              </Link>

              <button type="submit" className="btn-save">
                Continuer
              </button>
            </div>

          </form>
        </>
      )}

      {/* ÉTAPE 2 : FICHE ARTICLE */}
      {etape === 2 && (
        <>
          <div className="form-title">
            <h2>Fiche article</h2>
            <p>Ajouter les articles de cet achat.</p>
          </div>

          <div className="form-section">
            <h3>Informations de l'achat</h3>

            <p>
              <strong>Fournisseur :</strong>{" "}
              {fournisseurChoisi?.nom}
            </p>

            <p>
              <strong>Bon d'achat :</strong>{" "}
              {achat.numero_bon}
            </p>

            <p>
              <strong>Facture :</strong>{" "}
              {achat.numero_facture || "Non renseignée"}
            </p>
          </div>

          {/* Articles déjà ajoutés */}
          <div className="form-section">
            <h3>Articles ajoutés : {articles.length}</h3>

            {articles.length === 0 ? (
              <p>Aucun article ajouté pour le moment.</p>
            ) : (
              <ul>
                {articles.map((article, index) => (
                  <li key={index}>
                    {article.nom} — Quantité : {article.quantite}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            className="product-form"
            ref={formulaireRef}
            onSubmit={(e) => e.preventDefault()}
          >

            {/* Informations générales */}
            <div className="form-section">
              <h3>Informations générales</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>Référence</label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="Ex : REF-001"
                  />
                </div>

                <div className="form-group">
                  <label>Code-barres</label>
                  <input
                    type="text"
                    name="code_barres"
                    placeholder="Code-barres"
                  />
                </div>

                <div className="form-group">
                  <label>Nom de l'article *</label>
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom de l'article"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Marque</label>
                  <input
                    type="text"
                    name="marque"
                    placeholder="Marque"
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie *</label>

                  <select name="categorie_id" required>
                    <option value="">Choisir une catégorie</option>

                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>

                  <Link to="/categories" className="btn-inline">
                    + Ajouter une catégorie
                  </Link>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>

                  <textarea
                    name="description"
                    placeholder="Description de l'article..."
                  />
                </div>

              </div>
            </div>

            {/* Prix et quantité */}
            <div className="form-section">
              <h3>Prix et quantité reçue</h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>Prix d'achat (DA) *</label>

                  <input
                    type="number"
                    name="prix_achat"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Prix de vente (DA) *</label>

                  <input
                    type="number"
                    name="prix"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantité reçue *</label>

                  <input
                    type="number"
                    name="quantite"
                    min="1"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Seuil d'alerte</label>

                  <input
                    type="number"
                    name="seuil_alerte"
                    min="0"
                    defaultValue="5"
                  />
                </div>

                <div className="form-group">
                  <label>Emplacement</label>

                  <input
                    type="text"
                    name="emplacement"
                    placeholder="Ex : Rayon A, Étagère 2"
                  />
                </div>

              </div>
            </div>

            {/* Image */}
            <div className="form-section">
              <h3>Image de l'article</h3>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Choisir une image</label>

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="btn-cancel"
                onClick={() => setEtape(1)}
              >
                Retour
              </button>

              <button
                type="button"
                className="btn-inline"
                onClick={ajouterAutreArticle}
              >
                + Ajouter un autre article
              </button>

              <button
                type="button"
                className="btn-save"
                onClick={terminerAchat}
              >
                Terminer l'achat
              </button>

            </div>

          </form>
        </>
      )}

      {/* ÉTAPE 3 : RÉCAPITULATIF */}
      {etape === 3 && (
        <div className="form-section">
          <h2>Achat terminé !</h2>

          <p>
            Fournisseur : {fournisseurChoisi?.nom}
          </p>

          <p>Bon d'achat : {achat.numero_bon}</p>

          <p>
            Facture : {achat.numero_facture || "Non renseignée"}
          </p>

          <h3>Articles de cet achat</h3>

          <ul>
            {articles.map((article, index) => (
              <li key={index}>
                {article.nom} — {article.quantite} unités
              </li>
            ))}
          </ul>

          <p>
            Nombre total d'articles : {articles.length}
          </p>

          <Link to="/stock" className="btn-save">
            Retour au stock
          </Link>
        </div>
      )}

    </section>
  );
}

export default NouvelArticle;
