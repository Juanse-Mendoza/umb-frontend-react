import { useEffect, useState } from "react";

// URL de tu API PHP (ajústala cuando esté en Render)
const API_URL = "http://localhost/umb-backend-php/api/";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");

  // ------------------------------------------------------------------
  // GET: Obtener todas las tareas al cargar el componente
  // ------------------------------------------------------------------
  const obtenerTareas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  // ------------------------------------------------------------------
  // POST: Crear nueva tarea
  // ------------------------------------------------------------------
  const crearTarea = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, completada: false }),
      });

      const nueva = await res.json();

      // Actualizar lista
      setTareas([...tareas, nueva[0]]); // Supabase devuelve array
      setTitulo("");
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  // ------------------------------------------------------------------
  // PATCH: Marcar tarea como completada
  // ------------------------------------------------------------------
  const completarTarea = async (id, estadoActual) => {
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          completada: !estadoActual,
          titulo: tareas.find((t) => t.id === id).titulo,
        }),
      });

      await res.json();
      obtenerTareas(); // refrescar
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // ------------------------------------------------------------------
  // DELETE: Eliminar una tarea
  // ------------------------------------------------------------------
  const eliminarTarea = async (id) => {
    try {
      await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      // Actualizar la lista sin recargar
      setTareas(tareas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>Gestor de Tareas (React + PHP + Supabase)</h1>

      {/* Formulario */}
      <form onSubmit={crearTarea} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{
            padding: 10,
            width: "70%",
            marginRight: 10,
            fontSize: "16px",
          }}
        />
        <button type="submit" style={{ padding: "10px 20px", fontSize: 16 }}>
          Añadir
        </button>
      </form>

      {/* Lista */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tareas.map((t) => (
          <li
            key={t.id}
            style={{
              padding: 10,
              marginBottom: 10,
              background: "#f4f4f4",
              borderRadius: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <input
                type="checkbox"
                checked={t.completada}
                onChange={() => completarTarea(t.id, t.completada)}
                style={{ marginRight: 10 }}
              />
              {t.titulo}
            </span>

            <button
              onClick={() => eliminarTarea(t.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: 5,
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
