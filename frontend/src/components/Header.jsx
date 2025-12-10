import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <Link to="/">Accueil</Link>

      {user ? (
        <>
          {/* Liens visibles pour tous les utilisateurs connectés */}
          <Link to="/events" style={{ marginLeft: "10px" }}>
            Événements
          </Link>

          {/* Lien Admin visible uniquement si ADMIN */}
          {user.role === "ADMIN" && (
            <Link to="/admin" style={{ marginLeft: "10px" }}>
              Administration
            </Link>
          )}

          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: "10px" }}>
            Connexion
          </Link>
          <Link to="/register" style={{ marginLeft: "10px" }}>
            Inscription
          </Link>
        </>
      )}
    </nav>
  );
}
