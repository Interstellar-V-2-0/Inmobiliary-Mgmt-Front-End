import React from "react";
import { useAuth } from "../context/AuthProvider";

export default function HomePage() {
  const { logout } = useAuth();
  return (
    <div>
      <h1>Bienvenido (autenticado)</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
