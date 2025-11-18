import { useState, useEffect } from "react";
import "./App.css";

// ⚠️ Ajusta la URL de tu backend:
const API_URL = "const API_URL = https://umb-web-taller-7zj4.onrender.com/";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  // 📌 Obtener todas las tareas del backend
  const fetchTareas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error("Error obteniendo tareas:", error);
    }
  };

  // 📌 Crear una nueva tarea
  const crearTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: nuevaTarea }),
      });

      setNuevaTarea("");
      fetchTareas();
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  // 📌 Eliminar una tarea
  const eliminarTarea = async (id) => {
    try {
      await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
      fetchTareas();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  // 📌 Inicializar tareas al cargar la app
  useEffect(() => {
    fetchTareas();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>Gestión de Tareas</h1>

        {/* Formulario para añadir tareas */}
        <form className="form" onSubmit={crearTarea}>
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
          />
          <button type="submit">Añadir</button>
        </form>

        {/* Lista de tareas */}
        <ul className="lista">
          {tareas.length === 0 ? (
            <p className="no-tareas">No hay tareas todavía.</p>
          ) : (
            tareas.map((t) => (
              <li key={t.id}>
                <span>{t.titulo}</span>
                <button className="delete" onClick={() => eliminarTarea(t.id)}>
                  ✖
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
