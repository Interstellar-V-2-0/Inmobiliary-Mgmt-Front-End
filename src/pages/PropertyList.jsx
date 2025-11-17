import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Obtener token del localStorage
    const token = localStorage.getItem("token");

    // Si no hay token → ir a login
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(
                    "https://inmobiliarymgmt-production.up.railway.app/api/Property",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener propiedades");
                }

                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProperties();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <h2>Cargando propiedades...</h2>;

    return (
        <div>
            <h1>Lista de propiedades</h1>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => navigate("/properties/create")}>
                    Crear Propiedad
                </button>
                <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
                    Logout
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
                            <button
                                onClick={() => navigate(`/properties/edit/${p.id}`)}
                                style={{ marginLeft: "10px" }}
                            >
                                Editar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
