import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  const liens = [
    { nom: "Tableau de bord", chemin: "/", icone: "▦" },
    { nom: "Stock", chemin: "/stock", icone: "▤" },
    { nom: "Catégories", chemin: "/categories", icone: "▧" },
    { nom: "Fournisseurs", chemin: "/fournisseurs", icone: "♙" },
    { nom: "Clients", chemin: "/clients", icone: "♧" },
    { nom: "Achats", chemin: "/achats", icone: "↓" },
    { nom: "Ventes", chemin: "/ventes", icone: "↑" },
    { nom: "Devis", chemin: "/devis", icone: "▣" },
    { nom: "Paiements", chemin: "/paiements", icone: "€" },
    { nom: "Retours", chemin: "/retours", icone: "↩" },
    { nom: "Nouvel article", chemin: "/nouvel-article", icone: "..." },
    { nom: "Utilisateurs", chemin: "/utilisateurs", icone: "♙" },
    { nom: "Historique", chemin: "/historique", icone: "◷" },
  ];

  return (
    <div className="application">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">S</span>
          <span>StockPro</span>
        </div>

        <p className="menu-label">MENU PRINCIPAL</p>

        <nav className="navigation">
          {liens.map((lien) => (
            <NavLink
              key={lien.chemin}
              to={lien.chemin}
              end={lien.chemin === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>{lien.icone}</span>
              {lien.nom}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span className="status-dot"></span>
          Application de gestion
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">StockPro / Gestion</p>
            <h1>Gestion du stock</h1>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Administrateur</strong>
              <span>Gestionnaire de stock</span>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;