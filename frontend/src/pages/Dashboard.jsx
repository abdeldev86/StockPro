
import { useEffect, useState } from "react";

function Dashboard() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/produits")
      .then((response) => response.json())
      .then((data) => setStock(data))
      .catch((erreur) => console.error("Erreur stock :", erreur));
  }, []);

  const totalUnites = stock.reduce(
    (total, article) => total + Number(article.quantite || 0),
    0
  );

  const stockFaible = stock.filter(
    (article) =>
      Number(article.quantite) <= Number(article.seuil_alerte ?? 5)
  ).length;

  return (
    <>
      <section className="welcome">
        <div>
          <p className="welcome-label">ESPACE DE GESTION</p>
          <h2>Bonjour, bienvenue !</h2>
          <p>Voici un aperçu de votre stock aujourd'hui.</p>
        </div>

        <div className="welcome-icon">📦</div>
      </section>

      <section className="stats">

        <article className="stat-card">
          <div className="stat-heading">
            <span>Articles enregistrés</span>
            <span className="stat-icon purple">▤</span>
          </div>

          <strong className="stat-number">{stock.length}</strong>
          <p>Références dans le stock</p>
        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Unités en stock</span>
            <span className="stat-icon blue">▦</span>
          </div>

          <strong className="stat-number">{totalUnites}</strong>
          <p>Quantité totale disponible</p>
        </article>

        <article className="stat-card">
          <div className="stat-heading">
            <span>Stock faible</span>
            <span className="stat-icon orange">!</span>
          </div>

          <strong className="stat-number">{stockFaible}</strong>
          <p>Articles à réapprovisionner</p>
        </article>

      </section>
    </>
  );
}

export default Dashboard;
