const API_URL = "https://inmobiliarymgmt-production.up.railway.app/api/Property";

export const PropertyService = {
    async getAll() {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error obteniendo propiedades");
        return res.json();
    },

    async getById(id) {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Propiedad no encontrada");
        return res.json();
    },

    async create(dto, token) {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        if (!res.ok) throw new Error("Error creando propiedad");
        return res.json();
    },

    async update(id, dto, token) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        if (!res.ok) throw new Error("Error actualizando propiedad");
        return res.json();
    },

    async remove(id, token) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Error eliminando propiedad");
    },
};
