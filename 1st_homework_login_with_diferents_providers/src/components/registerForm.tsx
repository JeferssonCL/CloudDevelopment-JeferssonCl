"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppUserExtended, RegisterFormValues } from "@/types/user";
import * as yup from "yup";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, facebookProvider } from "@/credentials";
import "@/styles/auth-style.css";

const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  email: yup.string().email("Correo inválido").required("Correo requerido"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
  address: yup
    .string()
    .required("Dirección requerida")
    .min(6, "Mínimo 6 caracteres"),
  birthdate: yup
    .string()
    .required("Fecha de nacimiento requerida")
    .test(
      "valid-date",
      "Fecha inválida o debes ser mayor de 18 años",
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;
        const today = new Date();
        const minAgeDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        return date <= minAgeDate;
      }
    ),
  age: yup
    .number()
    .typeError("Edad debe ser un número")
    .min(18, "Edad inválida")
    .max(120, "Edad inválida")
    .required("Edad requerida"),
});

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const form = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onRegister = async (data: RegisterFormValues) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const uid = userCred.user.uid;

      const extendedUser: AppUserExtended = {
        uid,
        email: data.email,
        displayName: userCred.user.displayName,
        providers: userCred.user.providerData.map((p) => p.providerId),
        address: data.address,
        birthdate: data.birthdate,
        age: data.age,
      };

      await setDoc(doc(db, "users", uid), extendedUser);
      alert("Usuario registrado correctamente");
    } catch (e: unknown) {
      if (e instanceof Error) alert("Error al registrarse: " + e.message);
    }
  };

  const handleSocialLogin = async (
    provider: typeof googleProvider | typeof facebookProvider
  ) => {
    try {
      await signInWithPopup(auth, provider);
      alert("Registro exitoso");
    } catch (e: unknown) {
      if (e instanceof Error) alert("Error: " + e.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={form.handleSubmit(onRegister)} className="auth-form">
        <h2 className="auth-title">Crear Cuenta</h2>

        <div className="form-row">
          <div className="form-group">
            <input
              placeholder="Correo electrónico"
              className="form-input"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="error-message">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              className="form-input"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="error-message">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <input
            placeholder="Dirección completa"
            className="form-input"
            {...form.register("address")}
          />
          {form.formState.errors.address && (
            <p className="error-message">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              className="form-input"
              {...form.register("birthdate")}
            />
            {form.formState.errors.birthdate && (
              <p className="error-message">
                {form.formState.errors.birthdate.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Edad"
              className="form-input"
              min="0"
              max="120"
              {...form.register("age")}
            />
            {form.formState.errors.age && (
              <p className="error-message">
                {form.formState.errors.age.message}
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Crear Cuenta
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSwitchToLogin}
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </button>

        <div className="divider">
          <span>o regístrate con</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="btn btn-google"
            onClick={() => handleSocialLogin(googleProvider)}
          >
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Registrarse con Google
          </button>

          <button
            type="button"
            className="btn btn-facebook"
            onClick={() => handleSocialLogin(facebookProvider)}
          >
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Registrarse con Facebook
          </button>
        </div>
      </form>
    </div>
  );
};
