import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [userRole, setUserRole] = useState(""); // <-- guardamos el rol
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!token) navigate("/login");

        const decoded = decodeToken(token);
        if (decoded && decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
            setUserRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        }
    }, [token, navigate]);

    const fetchProperties = async (id = null) => {
        setLoading(true);
        try {
            const url = id
                ? `https://inmobiliarymgmt-production.up.railway.app/api/Property/${id}`
                : "https://inmobiliarymgmt-production.up.railway.app/api/Property";

            const response = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Error al obtener propiedades");

            const data = await response.json();
            setProperties(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchProperties();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSearch = () => {
        if (searchId.trim() === "") {
            fetchProperties();
        } else {
            fetchProperties(searchId.trim());
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta propiedad?")) return;

        try {
            const response = await fetch(
                `https://inmobiliarymgmt-production.up.railway.app/api/Property/${id}`,
                {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error("Error al eliminar propiedad");

            // Actualizar lista sin la propiedad eliminada
            setProperties(properties.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error eliminando propiedad:", error);
        }
    };

    if (loading) return <h2>Cargando propiedades...</h2>;

    return (
        <div>
            <h1>Lista de propiedades</h1>

            <div style={{ marginBottom: "20px" }}>
                {userRole === "Admin" && (
                    <button onClick={() => navigate("/properties/create")}>
                        Crear Propiedad
                    </button>
                )}
                <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
                    Logout
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Buscar por ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
                    Buscar
                </button>
            </div>

            {properties.length === 0 ? (
                <p>No hay propiedades registradas.</p>
            ) : (
                <ul>
                    {properties.map((p) => (
                        <li key={p.id}>
                            <Link to={`/properties/${p.id}`}>
                                <strong>{p.title}</strong> — {p.address} — ${p.price}
                            </Link>
                            {userRole === "Admin" && (
                                <>
                                    <button
                                        onClick={() => navigate(`/properties/edit/${p.id}`)}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        style={{ marginLeft: "10px", color: "red" }}
                                    >
                                        Eliminar
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
