
import { useState } from "react";

function Achats() {
  // Données provisoires pour tester le frontend
  const fournisseurs = [
    { id: 1, nom: "Fournisseur Europe" },
    { id: 2, nom: "Grossiste Alger" },
    { id: 3, nom: "Import Distribution" },
  ];

  const produits = [
    { id: 1, nom: "Casque Bluetooth", prix_achat: 2500 },
    { id: 2, nom: "Souris", prix_achat: 1000 },
    { id: 3, nom: "Clavier", prix_achat: 1800 },
  ];

  const [achats, setAchats] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  const [formulaire, setFormulaire] = useState({
    numero_achat: "",
    fournisseur_id: "",
    date_achat: new Date().toISOString().slice(0, 10),
    statut: "brouillon",
    montant_paye: 0,
    notes: "",
  });

  const [lignes, setLignes] = useState([
    {
      id: Date.now(),
      produit_id: "",
      quantite: 1,
      prix_unitaire: 0,
      remise: 0,
    },
  ]);

  // Modifier les informations générales de l'achat
  function modifierFormulaire(e) {
    const { name, value } = e.target;

    setFormulaire({
      ...formulaire,
      [name]: value,
    });
  }

  // Ajouter une ligne de produit
  function ajouterLigne() {
    setLignes([
      ...lignes,
      {
        id: Date.now(),
        produit_id: "",
        quantite: 1,
        prix_unitaire: 0,
        remise: 0,
      },
    ]);
  }

  // Modifier une ligne
  function modifierLigne(id, champ, valeur) {
    setLignes(
      lignes.map((ligne) =>
        ligne.id === id
          ? { ...ligne, [champ]: valeur }
          : ligne
      )
    );
  }

  // Choisir un produit et récupérer son prix d'achat
  function choisirProduit(id, produitId) {
    const produit = produits.find(
      (element) => element.id === Number(produitId)
    );

    setLignes(
      lignes.map((ligne) =>
        ligne.id === id
          ? {
              ...ligne,
              produit_id: produitId,
              prix_unitaire: produit ? produit.prix_achat : 0,
            }
          : ligne
      )
    );
  }

  // Supprimer une ligne
  function supprimerLigne(id) {
    setLignes(lignes.filter((ligne) => ligne.id !== id));
  }

  // Calculer le total d'une ligne
  function calculerTotalLigne(ligne) {
    return Math.max(
      0,
      Number(ligne.quantite) * Number(ligne.prix_unitaire) -
        Number(ligne.remise)
    );
  }

  // Calculer le total de l'achat
  const totalHT = lignes.reduce(
    (total, ligne) => total + calculerTotalLigne(ligne),
    0
  );

  // Enregistrer l'achat provisoirement
  function enregistrerAchat(e) {
    e.preventDefault();

    if (!formulaire.fournisseur_id) {
      alert("Veuillez choisir un fournisseur.");
      return;
    }

    if (lignes.length === 0) {
      alert("Veuillez ajouter au moins un produit.");
      return;
    }

    const ligneInvalide = lignes.some(
      (ligne) =>
        !ligne.produit_id ||
        Number(ligne.quantite) <= 0 ||
        Number(ligne.prix_unitaire) < 0 ||
        Number(ligne.remise) < 0 ||
        Number(ligne.remise) >
          Number(ligne.quantite) * Number(ligne.prix_unitaire)
    );

    if (ligneInvalide) {
      alert("Veuillez vérifier les produits, quantités, prix et remises.");
      return;
    }

    const nouvelAchat = {
      id: Date.now(),
      ...formulaire,
      fournisseur: fournisseurs.find(
        (f) => f.id === Number(formulaire.fournisseur_id)
      )?.nom,
      lignes: lignes.map((ligne) => ({
        ...ligne,
        nom_produit: produits.find(
          (p) => p.id === Number(ligne.produit_id)
        )?.nom,
        total_ligne: calculerTotalLigne(ligne),
      })),
      total_ht: totalHT,
      montant_paye: Number(formulaire.montant_paye),
    };

    setAchats([...achats, nouvelAchat]);

    setFormulaire({
      numero_achat: "",
      fournisseur_id: "",
      date_achat: new Date().toISOString().slice(0, 10),
      statut: "brouillon",
      montant_paye: 0,
      notes: "",
    });

    setLignes([
      {
        id: Date.now() + 1,
        produit_id: "",
        quantite: 1,
        prix_unitaire: 0,
        remise: 0,
      },
    ]);

    setAfficherFormulaire(false);
    alert("Achat enregistré avec succès !");
  }

  function formatPrix(prix) {
    return Number(prix).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " DA";
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Gestion des achats</h2>
          <p>Suivi des factures et des approvisionnements.</p>
        </div>

        <button
          className="btn-save"
          onClick={() => setAfficherFormulaire(!afficherFormulaire)}
        >
          {afficherFormulaire ? "Fermer" : "+ Nouvel achat"}
        </button>
      </div>

      {afficherFormulaire && (
        <form className="product-form" onSubmit={enregistrerAchat}>
          <div className="form-section">
            <h3>Informations de l'achat</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Numéro de facture / achat</label>
                <input
                  type="text"
                  name="numero_achat"
                  value={formulaire.numero_achat}
                  onChange={modifierFormulaire}
                  placeholder="Ex : ACH-001"
                />
              </div>

              <div className="form-group">
                <label>Fournisseur *</label>
                <select
                  name="fournisseur_id"
                  value={formulaire.fournisseur_id}
                  onChange={modifierFormulaire}
                  required
                >
                  <option value="">Choisir un fournisseur</option>
                  {fournisseurs.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date d'achat</label>
                <input
                  type="date"
                  name="date_achat"
                  value={formulaire.date_achat}
                  onChange={modifierFormulaire}
                />
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select
                  name="statut"
                  value={formulaire.statut}
                  onChange={modifierFormulaire}
                >
                  <option value="brouillon">Brouillon</option>
                  <option value="recu">Reçu</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Produits achetés</h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Remise (DA)</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td>
                        <select
                          value={ligne.produit_id}
                          onChange={(e) =>
                            choisirProduit(ligne.id, e.target.value)
                          }
                          required
                        >
                          <option value="">Choisir</option>
                          {produits.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nom}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input
                          type="number"
                          min="1"
                          value={ligne.quantite}
                          onChange={(e) =>
                            modifierLigne(
                              ligne.id,
                              "quantite",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={ligne.prix_unitaire}
                          onChange={(e) =>
                            modifierLigne(
                              ligne.id,
                              "prix_unitaire",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={ligne.remise}
                          onChange={(e) =>
                            modifierLigne(
                              ligne.id,
                              "remise",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>{formatPrix(calculerTotalLigne(ligne))}</td>

                      <td>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => supprimerLigne(ligne.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="btn-inline"
              onClick={ajouterLigne}
            >
              + Ajouter un produit
            </button>
          </div>

          <div className="form-section">
            <h3>Paiement et observations</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Montant payé (DA)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="montant_paye"
                  value={formulaire.montant_paye}
                  onChange={modifierFormulaire}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formulaire.notes}
                  onChange={modifierFormulaire}
                  rows="3"
                />
              </div>
            </div>

            <div className="purchase-total">
              <h3>Total achat : {formatPrix(totalHT)}</h3>
              <p>
                Reste à payer :{" "}
                {formatPrix(totalHT - Number(formulaire.montant_paye))}
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setAfficherFormulaire(false)}
            >
              Annuler
            </button>

            <button type="submit" className="btn-save">
              Enregistrer l'achat
            </button>
          </div>
        </form>
      )}

      <div className="form-section">
        <h3>Historique des achats</h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Fournisseur</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payé</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {achats.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucun achat enregistré.</td>
                </tr>
              ) : (
                achats.map((achat) => (
                  <tr key={achat.id}>
                    <td>{achat.numero_achat || "Sans numéro"}</td>
                    <td>{achat.fournisseur}</td>
                    <td>{achat.date_achat}</td>
                    <td>{formatPrix(achat.total_ht)}</td>
                    <td>{formatPrix(achat.montant_paye)}</td>
                    <td>{achat.statut}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Achats;
