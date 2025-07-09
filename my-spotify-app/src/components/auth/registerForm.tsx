"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppUserExtended, RegisterFormValues } from "@/types/user";
import * as yup from "yup";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, facebookProvider } from "@/credentials";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useRouter } from "next/navigation";

const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  displayName: yup
    .string()
    .required("Nombre requerido")
    .min(2, "Mínimo 2 caracteres"),
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

export const RegisterForm = () => {
  const form = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });
  const router = useRouter();

  const onRegister = async (data: RegisterFormValues) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const uid = userCred.user.uid;

      await updateProfile(userCred.user, {
        displayName: data.displayName,
      });

      const extendedUser: AppUserExtended = {
        uid,
        email: data.email,
        displayName: data.displayName,
        providers: userCred.user.providerData.map((p) => p.providerId),
        address: data.address,
        birthdate: data.birthdate,
        age: data.age,
      };

      await setDoc(doc(db, "users", uid), extendedUser);
      router.push("/signIn");
    } catch (e: unknown) {
      if (e instanceof Error) alert("Error al registrarse: " + e.message);
    }
  };

  const handleSocialLogin = async (
    provider: typeof googleProvider | typeof facebookProvider
  ) => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/signIn");
    } catch (e: unknown) {
      if (e instanceof Error) alert("Error: " + e.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        mx: "auto",
        p: 4,
        bgcolor: "#181818",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#fff",
          fontWeight: "bold",
          mb: 4,
          letterSpacing: "-0.5px",
        }}
      >
        Crear cuenta
      </Typography>

      <form onSubmit={form.handleSubmit(onRegister)}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Nombre completo"
            variant="filled"
            {...form.register("displayName")}
            error={!!form.formState.errors.displayName}
            helperText={form.formState.errors.displayName?.message}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#333",
                borderRadius: "4px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
            }}
            FormHelperTextProps={{
              style: { color: "#ff4d4d" },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Correo electrónico"
            variant="filled"
            {...form.register("email")}
            error={!!form.formState.errors.email}
            helperText={form.formState.errors.email?.message}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#333",
                borderRadius: "4px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
            }}
            FormHelperTextProps={{
              style: { color: "#ff4d4d" },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            variant="filled"
            {...form.register("password")}
            error={!!form.formState.errors.password}
            helperText={form.formState.errors.password?.message}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#333",
                borderRadius: "4px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
            }}
            FormHelperTextProps={{
              style: { color: "#ff4d4d" },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Dirección completa"
            variant="filled"
            {...form.register("address")}
            error={!!form.formState.errors.address}
            helperText={form.formState.errors.address?.message}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#333",
                borderRadius: "4px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
            }}
            FormHelperTextProps={{
              style: { color: "#ff4d4d" },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de nacimiento"
            variant="filled"
            InputLabelProps={{
              shrink: true,
              style: { color: "#b3b3b3" },
            }}
            {...form.register("birthdate")}
            error={!!form.formState.errors.birthdate}
            helperText={form.formState.errors.birthdate?.message}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#333",
                borderRadius: "4px",
                color: "#fff",
              },
            }}
            FormHelperTextProps={{
              style: { color: "#ff4d4d" },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            type="number"
            label="Edad"
            variant="filled"
            inputProps={{ min: 0, max: 120 }}
            {...form.register("age")}
            error={!!form.formState.errors.age}
            helperText={form.formState.errors.age?.message}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#333",
                borderRadius: "4px",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
            }}
            FormHelperTextProps={{
              style: { color: "#ff4d4d" },
            }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mb: 3,
            py: 1.5,
            backgroundColor: "#01c4e7",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "500px",
            textTransform: "none",
            letterSpacing: "0.5px",
            "&:hover": {
              backgroundColor: "#01c4e7",
              transform: "scale(1.02)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Crear cuenta
        </Button>

        <Divider
          sx={{
            my: 3,
            borderColor: "#333",
            "&::before, &::after": {
              borderColor: "#333",
            },
          }}
        >
          <Typography variant="body2" sx={{ color: "#b3b3b3", px: 2 }}>
            o
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleSocialLogin(googleProvider)}
            sx={{
              py: 1.5,
              borderColor: "#535353",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "500px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Continuar con Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => handleSocialLogin(facebookProvider)}
            sx={{
              py: 1.5,
              borderColor: "#535353",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "500px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Continuar con Facebook
          </Button>
        </Box>

        <Typography
          align="center"
          sx={{
            color: "#b3b3b3",
            mt: 3,
          }}
        >
          ¿Ya tienes una cuenta?{" "}
          <Box
            component="span"
            onClick={() => router.push("/signIn")}
            sx={{
              cursor: "pointer",
              color: "#01c4e7",
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Inicia sesión
          </Box>
        </Typography>
      </form>
    </Box>
  );
};
