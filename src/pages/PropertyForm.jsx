import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PropertyForm() {
    const { id } = useParams(); // Si existe → es edición
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        address: "",
        price: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingProperty, setLoadingProperty] = useState(true);
    const [userRole, setUserRole] = useState(""); // <-- guardamos el rol

    const API_URL = "https://inmobiliarymgmt-production.up.railway.app/api/Property";
    const token = localStorage.getItem("token");

    // Función para decodificar JWT
    const decodeToken = (token) => {
        if (!token) return null;
        try {
            const payload = token.split(".")[1];
            return JSON.parse(atob(payload));
        } catch {
            return null;
        }
    };

    // Cargar rol del usuario y propiedad si es edición
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const decoded = decodeToken(token);
        if (decoded && decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
            setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        }

        if (!id) {
            setLoadingProperty(false);
            return;
        }

        const fetchProperty = async () => {
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Error al cargar propiedad");
                const data = await res.json();

                setForm({
                    title: data.title,
                    address: data.address,
                    price: data.price,
                    description: data.description
                });
            } catch (error) {
                console.error("Error cargando propiedad:", error);
            } finally {
                setLoadingProperty(false);
            }
        };

        fetchProperty();
    }, [id, token, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `${API_URL}/${id}` : API_URL;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error("Error al guardar");

            navigate("/properties");
        } catch (error) {
            console.error("Error guardando:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loadingProperty) return <h2>Cargando datos...</h2>;

    return (
        <div>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <button type="button" onClick={() => navigate("/properties")}>Volver a la lista</button>

            <h1>{id ? "Editar Propiedad" : "Crear Propiedad"}</h1>

            {userRole === "Admin" ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Título</label><br />
                        <input type="text" name="title" value={form.title} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Dirección</label><br />
                        <input type="text" name="address" value={form.address} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Precio</label><br />
                        <input type="number" name="price" value={form.price} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Descripción</label><br />
                        <textarea name="description" value={form.description} onChange={handleChange} rows="4"></textarea>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}
                    </button>
                </form>
            ) : (
                <p>No tienes permisos para crear o editar propiedades.</p>
            )}
        </div>
    );
}
