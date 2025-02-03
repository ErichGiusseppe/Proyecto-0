import "./tareas.css";
import api from "../../api.js";
import React, { useState, useEffect } from "react";
import Navbar from '../Navbar/Navbar';
import { useNavigate } from "react-router";
export default function Categoria() {
    const [tareas, setTareas] = useState([]);
    const [id_usuario, setIdUsuario] = useState("")
    const [formData, setFormData] = useState({
        nombre:"",
        descripcion:""
    });
    const [categorias, setCategorias] = useState([]);


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

    const postCrearCategoria = async () => {
        const response = await api.post("/categorias/", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response.data;
        fetchCategorias();
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

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const decodedPayload = decodeJWT(token);
            if (decodedPayload) {
                setFormData((prevState) => ({ 
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
                <header className="todo-header">Crea una Categoria</header>

                <form className="todo-form">
                <input
                    type="text"
                    className="todo-input"
                    placeholder="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} // Corregido
                />
                <input
                    type="text"
                    className="todo-input"
                    placeholder="Descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} // Corregido
                />
                    <button
                        type="submit"
                        className="todo-button"
                        onClick={(e) => {
                            e.preventDefault();
                            postCrearCategoria();
                        }}
                    >
                        Añadir Categoria
                    </button>
                </form>

                <header className="todo-header">Lista de Categorias</header>
                <div className="tareas-list">
                    {categorias.map((categoria) => (
                        <div key={categoria.id} className="tarea-card">
                            <h3>{categoria.nombre}</h3>
                            <p><strong>Nombre:</strong> {categoria.nombre}</p>
                            <p><strong>Descripcion:</strong> {categoria.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
