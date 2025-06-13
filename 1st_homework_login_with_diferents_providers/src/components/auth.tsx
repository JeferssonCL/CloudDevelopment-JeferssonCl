"use client";

import { useState } from "react";
import { LoginForm } from "./loginForm";
import { RegisterForm } from "./registerForm";
import "@/styles/auth-style.css";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <>
      {isLogin ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};
