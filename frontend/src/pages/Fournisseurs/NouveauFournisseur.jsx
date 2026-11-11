
import { useNavigate } from "react-router-dom";
import FormulaireFournisseur from "./FormulaireFournisseur";

const CLE_FOURNISSEURS = "stockpro-fournisseurs";

function NouveauFournisseur() {
  const navigate = useNavigate();

  function enregistrerFournisseur(donnees) {
    try {
      const fournisseursEnregistres = JSON.parse(
        localStorage.getItem(CLE_FOURNISSEURS) || "[]"
      );

      if (!Array.isArray(fournisseursEnregistres)) {
        alert("Les données des fournisseurs sont invalides.");
        return;
      }

      const nouveauFournisseur = {
        ...donnees,
        id: Date.now(),
        actif: true,
        date_creation: new Date().toISOString(),
      };

      const nouvelleListe = [
        ...fournisseursEnregistres,
        nouveauFournisseur,
      ];

      localStorage.setItem(
        CLE_FOURNISSEURS,
        JSON.stringify(nouvelleListe)
      );

      // Ouvrir automatiquement la fiche du nouveau fournisseur
      navigate(`/fournisseurs/${nouveauFournisseur.id}`);
    } catch (erreur) {
      console.error("Erreur lors de l'enregistrement :", erreur);
      alert("Impossible d'enregistrer le fournisseur.");
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
        texteBouton="Enregistrer le fournisseur"
      />
    </div>
  );
}

export default NouveauFournisseur;
