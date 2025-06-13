"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/credentials";
import "@/styles/app.css";

export const Auth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password).catch((e) =>
      alert("Error al iniciar sesión: " + e.message)
    );
  };

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password).catch((e) =>
      alert("Error al registrarse: " + e.message)
    );
  };

  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch((e) =>
      alert("Error con Google: " + e.message)
    );
  };

  const loginWithFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        console.log("Inicio con Facebook exitoso", result);
      })
      .catch((e) => {
        console.error("Error con Facebook:", e);
        alert("Error con Facebook: " + e.message);
      });
  };

  return (
    <div className="auth-container">
      <h2>Autenticación</h2>
      <input
        className="input"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button-row">
        <button className="btn" onClick={register}>
          Registrarse
        </button>
        <button className="btn" onClick={login}>
          Iniciar sesión
        </button>
      </div>
      <hr />
      <button className="btn google" onClick={loginWithGoogle}>
        Iniciar con Google
      </button>
      <button className="btn facebook" onClick={loginWithFacebook}>
        Iniciar con Facebook
      </button>
      <hr />
    </div>
  );
};
