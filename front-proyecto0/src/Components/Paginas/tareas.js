import "./tareas.css";
import api from "../../api.js";
import React, { useState, useEffect } from "react";
import Navbar from '../Navbar/Navbar';
import { useNavigate } from "react-router";
export default function Tareas() {
    
    
    const [tareas, setTareas] = useState([]);
    const [id_usuario, setIdUsuario] = useState("")
    const [formData, setFormData] = useState({
        texto_tarea: "",
        estado: "",
        fecha_tentativa_finalizacion: "",
        fecha_creacion: new Date().toISOString().split('T')[0],
        id_usuario: "",
        id_categoria: "",
    });
    const [editData, setEditData] = useState({
        texto_tarea: "",
        estado: "",
        fecha_tentativa_finalizacion: "",
        fecha_creacion: new Date().toISOString().split('T')[0],
        id_usuario: "",
        id_categoria: "",
    });
    const [categorias, setCategorias] = useState([]);
    const [editandoTarea, setEditandoId] = useState(null);
    const iniciarEdicion = (tarea) => {
        setEditandoId(tarea.id);
        console.log(tarea.id)
        setEditData(prevState => ({
            ...prevState,
            id:tarea.id,
            texto_tarea: tarea.texto_tarea || prevState.texto_tarea,
            estado: tarea.estado || prevState.estado,
            fecha_tentativa_finalizacion: tarea.fecha_tentativa_finalizacion || prevState.fecha_tentativa_finalizacion,
            fecha_creacion: tarea.fecha_creacion || prevState.fecha_creacion,
            id_categoria: tarea.id_categoria || prevState.id_categoria,
        }));
    };
    const actualizarTarea = async () => {
        try {
            console.log(editandoTarea)
            console.log(editData)
            const response = await api.put(`/tareas/${editandoTarea}`, editData);

            fetchTareas();
            setEditandoId(null);
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    };

    const obtenerNombreCategoria = (idCategoria) => {
        const categoria = categorias.find(c => c.id === idCategoria);
        return categoria ? categoria.nombre : "Categoría no encontrada";
    };

    const fetchCategorias = async () => {
        try {
            const response = await api.get("/categorias/");
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setCategorias(response.data);
        } catch (error) {
            console.error("Error al obtener categorías:", error.message);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchTareas = async () => {
        try {
            
            
            console.log("id_user")
            console.log(id_usuario)
            const response = await api.get(`/usuarios/${id_usuario}/tareas`);
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setTareas(response.data);
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        }
    };

    useEffect(() => {
        if (id_usuario) {
            fetchTareas();
        }
    }, [id_usuario]);

    const eliminarTarea = async (id) => {
        try {
            await api.delete(`/tareas/${id}`);
            fetchTareas();
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    

    const postCrearTarea = async () => {
        const response = await api.post("/tareas/", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response.data;
        fetchTareas();
    };

    function decodeJWT(token) {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    const handleCategoriaChange = (event) => {
        setFormData({
            ...formData,
            id_categoria: event.target.value
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const decodedPayload = decodeJWT(token);
            if (decodedPayload) {
                setFormData((prevState) => ({ 
                    ...prevState, 
                    id_usuario: decodedPayload.id 
                }));
                setEditData((prevState) => ({ 
                    ...prevState, 
                    id_usuario: decodedPayload.id 
                }));
                setIdUsuario(decodedPayload.id );
            } else {
                console.log("Invalid token payload");
            }
        } else {
            console.log("No JWT found");
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="tareas-container">
                <header className="todo-header">Crea una Tarea</header>

                <form className="todo-form">
                    <input
                        type="text"
                        className="todo-input"
                        placeholder="Texto de la tarea"
                        value={formData.texto_tarea}
                        onChange={(e) => setFormData({ ...formData, texto_tarea: e.target.value })}
                    />
                    <input
                        type="text"
                        className="todo-input"
                        placeholder="Estado"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    />
                    <input
                        type="text"
                        className="todo-input"
                        placeholder="Fecha tentativa de finalización"
                        value={formData.fecha_tentativa_finalizacion}
                        onChange={(e) => setFormData({ ...formData, fecha_tentativa_finalizacion: e.target.value })}
                    />
                    <select
                        className="todo-input"
                        value={formData.id_categoria}
                        onChange={handleCategoriaChange}
                    >
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="todo-button"
                        onClick={(e) => {
                            e.preventDefault();
                            postCrearTarea();
                        }}
                    >
                        Añadir Tarea
                    </button>
                </form>

                {editandoTarea && (
                    <div className="modal-edicion">
                        <h3>Editar Tarea</h3>
                        <input
                            type="text"
                            value={editData.texto_tarea}
                            onChange={(e) => setEditData({ ...editData, texto_tarea: e.target.value })}
                        />
                        <input
                            type="text"
                            value={editData.estado}
                            onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                        />
                        <input
                            type="date"
                            value={editData.fecha_tentativa_finalizacion}
                            onChange={(e) => setEditData({ ...editData, fecha_tentativa_finalizacion: e.target.value })}
                        />
                        <select
                            className="todo-input"
                            value={editData.id_categoria}
                            onChange={(e) => setEditData({ ...editData, id_categoria: e.target.value })}
                        >
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        <button onClick={actualizarTarea}>Actualizar</button>
                        <button onClick={() => setEditandoId(null)}>Cancelar</button>
                    </div>
                )}

                <header className="todo-header">Lista de Tareas</header>
                <div className="tareas-list">
                    {tareas.map((tarea) => (
                        <div key={tarea.id} className="tarea-card">
                            <h3>{tarea.texto_tarea}</h3>
                            <p><strong>Estado:</strong> {tarea.estado}</p>
                            <p><strong>Fecha de Creación:</strong> {new Date(tarea.fecha_creacion).toLocaleString()}</p>
                            <p><strong>Fecha Tentativa de Finalización:</strong> {new Date(tarea.fecha_tentativa_finalizacion).toLocaleString()}</p>
                            <p><strong>Categoria:</strong> {obtenerNombreCategoria(tarea.id_categoria)}</p>
                            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
                            <button onClick={() => iniciarEdicion(tarea)}>Editar</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
