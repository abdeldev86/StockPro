
import { useState, useEffect } from "react";

function Clients() {
  const API = "http://localhost:5000/clients";

  const [clients, setClients] = useState([]);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [notes, setNotes] = useState("");

  const [clientModifie, setClientModifie] = useState(null);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);

  // Charger les clients
  function chargerClients() {
    setChargement(true);

    fetch(API)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Impossible de récupérer les clients.");
        }
        return res.json();
      })
      .then((data) => setClients(data))
      .catch((err) => setErreur(err.message))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerClients();
  }, []);

  // Vider le formulaire
  function viderFormulaire() {
    setNom("");
    setTelephone("");
    setEmail("");
    setAdresse("");
    setVille("");
    setNotes("");
    setClientModifie(null);
  }

  // Ajouter ou modifier un client
  async function enregistrerClient(e) {
    e.preventDefault();

    setErreur("");
    setMessage("");

    if (!nom.trim()) {
      setErreur("Veuillez saisir le nom du client.");
      return;
    }

    const donnees = {
      nom: nom.trim(),
      telephone,
      email,
      adresse,
      ville,
      notes,
    };

    try {
      const url = clientModifie
        ? `${API}/${clientModifie}`
        : API;

      const methode = clientModifie ? "PUT" : "POST";

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
        clientModifie
          ? "Client modifié avec succès."
          : "Client ajouté avec succès."
      );

      viderFormulaire();
      chargerClients();
    } catch (err) {
      setErreur(err.message);
    }
  }

  // Préparer la modification
  function modifierClient(client) {
    setClientModifie(client.id);
    setNom(client.nom);
    setTelephone(client.telephone || "");
    setEmail(client.email || "");
    setAdresse(client.adresse || "");
    setVille(client.ville || "");
    setNotes(client.notes || "");

    setErreur("");
    setMessage("");
  }

  // Activer ou désactiver un client
  async function changerStatut(client) {
    const nouveauStatut = !Boolean(Number(client.actif));

    const confirmation = window.confirm(
      nouveauStatut
        ? "Voulez-vous réactiver ce client ?"
        : "Voulez-vous désactiver ce client ?"
    );

    if (!confirmation) return;

    setErreur("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${client.id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actif: nouveauStatut }),
      });

      const resultat = await response.json();

      if (!response.ok) {
        throw new Error(resultat.message || "Impossible de modifier le statut.");
      }

      setMessage(
        nouveauStatut
          ? "Client réactivé avec succès."
          : "Client désactivé avec succès."
      );

      chargerClients();
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <section className="page">
      <h2>Gestion des clients</h2>

      <p>Ajoutez et gérez les informations de vos clients.</p>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Formulaire client */}
      <div className="form-section">
        <h3>
          {clientModifie ? "Modifier un client" : "Nouveau client"}
        </h3>

        <form onSubmit={enregistrerClient}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom du client *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom complet"
                required
              />
            </div>

            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse e-mail"
              />
            </div>

            <div className="form-group">
              <label>Ville</label>
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ville"
              />
            </div>

            <div className="form-group full-width">
              <label>Adresse</label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse du client"
              />
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>

          <div className="form-actions">
            {clientModifie && (
              <button
                type="button"
                className="btn-cancel"
                onClick={viderFormulaire}
              >
                Annuler
              </button>
            )}

            <button type="submit" className="btn-save">
              {clientModifie ? "Enregistrer les modifications" : "Ajouter le client"}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des clients */}
      <div className="form-section" style={{ marginTop: "25px" }}>
        <h3>Liste des clients ({clients.length})</h3>

        {chargement ? (
          <p>Chargement des clients...</p>
        ) : clients.length === 0 ? (
          <p>Aucun client enregistré.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>E-mail</th>
                  <th>Ville</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => {
                  const actif = Boolean(Number(client.actif));

                  return (
                    <tr key={client.id}>
                      <td>{client.nom}</td>
                      <td>{client.telephone || "-"}</td>
                      <td>{client.email || "-"}</td>
                      <td>{client.ville || "-"}</td>

                      <td>
                        {actif ? "Actif" : "Désactivé"}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => modifierClient(client)}
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() => changerStatut(client)}
                          style={{ marginLeft: "8px" }}
                        >
                          {actif ? "Désactiver" : "Réactiver"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Clients;
