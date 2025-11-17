import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    roleId: "",
    docTypeId: ""
  });

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/Auth/register`,
        form
      );

      console.log("REGISTER RESPONSE:", response.data);
      alert("Usuario registrado correctamente!");

    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);
      alert("Error en el registro, revisa los datos.");
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <form onSubmit={handleRegister}>

        <label>Nombre</label>
        <input 
          type="text" 
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Apellido</label>
        <input 
          type="text" 
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <label>Correo</label>
        <input 
          type="email" 
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input 
          type="password" 
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>ID Rol</label>
        <input 
          type="number" 
          name="roleId"
          value={form.roleId}
          onChange={handleChange}
          required
        />

        <label>ID del Tipo de Documento</label>
        <input 
          type="number" 
          name="docTypeId"
          value={form.docTypeId}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
