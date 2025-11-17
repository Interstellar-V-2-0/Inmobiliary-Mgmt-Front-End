import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PropertyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProperty = async () => {
            try {
                const response = await fetch(
                    `https://inmobiliarymgmt-production.up.railway.app/api/Property/${id}`,
                    {
                        headers: { "Authorization": `Bearer ${token}` }
                    }
                );

                if (!response.ok) throw new Error("Error al cargar la propiedad");

                const data = await response.json();
                setProperty(data);
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <h2>Cargando propiedad...</h2>;
    if (!property) return <h2>Propiedad no encontrada.</h2>;

    return (
        <div>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <button onClick={() => navigate("/properties")}>Volver a la lista</button>

            <h1>{property.title}</h1>
            <p><strong>Dirección:</strong> {property.address}</p>
            <p><strong>Precio:</strong> ${property.price}</p>
            <p><strong>Descripción:</strong> {property.description}</p>

            {property.propertyImages && property.propertyImages.length > 0 && (
                <div>
                    <h3>Imágenes</h3>
                    {property.propertyImages.map(img => (
                        <img
                            key={img.id}
                            src={img.url}
                            width="300"
                            alt="Property"
                            style={{ margin: "10px", borderRadius: "8px" }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
