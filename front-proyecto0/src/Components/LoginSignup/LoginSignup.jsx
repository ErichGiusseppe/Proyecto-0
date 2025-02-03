import React, { useState } from "react";
import "./LoginSignup.css";
import cuentaFavorita from "../Assets/cuenta-favorita.png";
import candaddeseguridad from "../Assets/candadoSeguridad.png";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";
const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");

    const [formData, setFormData] = useState({
        username:"",
        password:""
    });

    const handleSingup = async () => {

        const response = await api.post("/usuarios", formData,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const navigate = useNavigate();

    const handleLogIn = async () => {
        if (action === "Login") {
            console.log("Sending request with:", { username: formData.username, password: formData.password });
            try {
                const response = await api.post("/usuarios/token", 
                    new URLSearchParams({
                        grant_type: "password",
                        username: formData.username,
                        password: formData.password
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );
    
                if (response.status !== 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = response.data;
                console.log("Response:", data);
    
                localStorage.setItem("access_token", data.access_token);

                navigate("/tareas");
    
            } catch (error) {
                console.error("Error during login:", error);
            }
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={cuentaFavorita} alt="" />
                    <input 
                        type="text" 
                        placeholder="usuario" 
                        value={formData.username}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            username: e.target.value 
                        })}
                    />
                </div>
                <div className="input">
                    <img src={candaddeseguridad} alt="" />
                    <input 
                        type="password" 
                        placeholder="contraseña" 
                        value={formData.password}
                        onChange={(e) => setFormData({ 
                            ...formData, 
                            password: e.target.value 
                        })} 
                    />
                </div>
            </div>
            <div className="submit-container">
                <div 
                    className={action === "Login" ? "submit gray" : "submit"} 
                    onClick={() => {
                        setAction("Sign Up");
                        handleSingup();
                    }}
                >
                    Sign up
                </div>
                <div 
                    className={action === "Sign Up" ? "submit gray" : "submit"} 
                    onClick={() => {
                        setAction("Login");
                        handleLogIn();
                        }
                    }
                >
                    Login
                </div>
            </div>   
        </div>
    );
};

export default LoginSignup;
