import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Bienvenue sur l'application de gestion d'événements</h1>
      {user ? (
        <p>Connecté en tant que : {user.email} ({user.role})</p>
      ) : (
        <p>Vous n'êtes pas connecté.</p>
      )}
    </div>
  );
}