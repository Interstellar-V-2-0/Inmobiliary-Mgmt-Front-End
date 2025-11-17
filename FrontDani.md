Documentación – Frontend Property Management
1. Estructura del proyecto

Carpeta base: CSharp/UH4/Front/

Componentes principales (páginas):

PropertyList.jsx – Lista de propiedades

PropertyDetail.jsx – Detalle de una propiedad

PropertyForm.jsx – Crear / Editar propiedad

Login.jsx – Login básico para obtener token de autenticación

Router:

AppRouter.jsx – Define rutas del proyecto usando react-router-dom

App principal:

import AppRouter from "./router/AppRouter";

function App() {
return <AppRouter />;
}

export default App;

2. Configuración de rutas (AppRouter.jsx)

Rutas principales:
 ````bash
<BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/properties/create" element={<PropertyForm />} />
        <Route path="/properties/edit/:id" element={<PropertyForm />} />
        <Route path="*" element={<PropertyList />} />
    </Routes>
</BrowserRouter>
````
3. Autenticación

Login.jsx:

Inputs para email y password.

fetch a POST /api/Auth/login para obtener token.

Guardamos token en localStorage.

Redirige a /properties al hacer login exitoso.

Logout:

Botón “Cerrar sesión” que borra localStorage y redirige a /login.

4. PropertyList.jsx

Funcionalidades:

Trae lista de propiedades desde GET /api/Property.

Botón para crear propiedad (navigate("/properties/create")).

Cada propiedad:

Link a detalle (/properties/:id)

Botón para editar (/properties/edit/:id)

Autenticación:

Si el usuario no tiene token, redirige a login (si lo agregamos en versiones futuras).

5. PropertyDetail.jsx

Funcionalidades:

Muestra detalle de la propiedad (GET /api/Property/:id).

Muestra imágenes si existen (propertyImages).

Botón “Cerrar sesión”.

Botón “Volver a la lista” (agregado como mejora).

Token:

Se obtiene desde localStorage y se envía en el header Authorization: Bearer <token>.

6. PropertyForm.jsx

Funcionalidades:

Formulario para crear o editar propiedad.

Campos: title, address, price, description.

handleSubmit:

POST si es nueva propiedad

PUT si es edición

Envía token en header Authorization

Botón “Cerrar sesión”

Botón “Volver a lista” 

Carga de datos en edición:

Si existe id en la URL, hace fetch de la propiedad para llenar formulario.

7. Tokens y autorización

Todos los fetch que requieren modificación (POST/PUT) incluyen el token en el header Authorization.

Token se obtiene del login y se guarda en localStorage.

Si no hay token, se redirige a /login.

8. Observaciones

Problema pendiente:

El backend está devolviendo 401 Unauthorized al guardar propiedad, incluso con token.

Por ahora, se agregaron botones de navegación para poder moverse sin depender del backend.


9. Próximos pasos sugeridos

Resolver el tema del backend que bloquea la creación/edición por token.

Mejorar estilos (CSS o framework tipo Tailwind/Material UI).

Integrar login real y validación de sesión en todas las páginas.
