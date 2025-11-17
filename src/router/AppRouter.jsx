import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyList from "../pages/PropertyList";
import PropertyDetail from "../pages/PropertyDetail";
import PropertyForm from "../pages/PropertyForm";
import Login from "../pages/Login";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/properties/create" element={<PropertyForm />} />
                <Route path="/properties/edit/:id" element={<PropertyForm />} />

                {/* Redireccionar raíz a /properties */}
                <Route path="*" element={<PropertyList />} />
            </Routes>
        </BrowserRouter>
    );
}
