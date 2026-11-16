
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormulaireFournisseur from "./FormulaireFournisseur";

const API_URL = "http://localhost:5000/fournisseurs";

function NouveauFournisseur() {
  const navigate = useNavigate();
  const [enregistrement, setEnregistrement] = useState(false);

  async function enregistrerFournisseur(donnees) {
    if (enregistrement) return;

    try {
      setEnregistrement(true);

      const reponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        throw new Error(
          resultat.message || "Impossible d'enregistrer le fournisseur."
        );
      }

      alert("Fournisseur ajouté avec succès !");

      // Ouvrir la fiche avec l'identifiant généré par MySQL
      navigate(`/fournisseurs/${resultat.id}`);
    } catch (erreur) {
      console.error("Erreur lors de l'enregistrement :", erreur);
      alert(erreur.message || "Impossible de contacter le serveur.");
    } finally {
      setEnregistrement(false);
    }
  }

  function annuler() {
    navigate("/fournisseurs");
  }

  return (
    <div className="page">
      <h1>Nouveau fournisseur</h1>

      <p>
        Ajouter un nouveau fournisseur à votre gestion commerciale.
      </p>

      <FormulaireFournisseur
        onEnregistrer={enregistrerFournisseur}
        onAnnuler={annuler}
        titre="Créer un fournisseur"
        texteBouton={
          enregistrement
            ? "Enregistrement..."
            : "Enregistrer le fournisseur"
        }
      />
    </div>
  );
}

export default NouveauFournisseur;
