
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";

import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import NouvelArticle from "./pages/NouvelArticle";
import Categories from "./pages/Categories";

// Fournisseurs
import Fournisseurs from "./pages/Fournisseurs/Fournisseurs";
import NouveauFournisseur from "./pages/Fournisseurs/NouveauFournisseur";
import FicheFournisseur from "./pages/Fournisseurs/FicheFournisseur";

import Clients from "./pages/Clients";
import Achats from "./pages/Achats";
import Ventes from "./pages/Ventes";
import Devis from "./pages/Devis";
import Paiements from "./pages/Paiements";
import Retours from "./pages/Retours";
import MouvementsStock from "./pages/MouvementsStock";
import Utilisateurs from "./pages/Utilisateurs";
import Historique from "./pages/Historique";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/nouvel-article" element={<NouvelArticle />} />
          <Route path="/categories" element={<Categories />} />

          {/* Gestion des fournisseurs */}
          <Route path="/fournisseurs" element={<Fournisseurs />} />
          <Route
            path="/fournisseurs/nouveau"
            element={<NouveauFournisseur />}
          />
          <Route
            path="/fournisseurs/:id"
            element={<FicheFournisseur />}
          />

          <Route path="/clients" element={<Clients />} />
          <Route path="/achats" element={<Achats />} />
          <Route path="/ventes" element={<Ventes />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/paiements" element={<Paiements />} />
          <Route path="/retours" element={<Retours />} />
          <Route path="/mouvements-stock" element={<MouvementsStock />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/historique" element={<Historique />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
