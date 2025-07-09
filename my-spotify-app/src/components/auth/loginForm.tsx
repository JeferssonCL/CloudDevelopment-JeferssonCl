"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/credentials";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useRouter } from "next/navigation";

const loginSchema = yup.object({
  email: yup.string().email("Correo inválido").required("Correo requerido"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
});

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });
  const router = useRouter();

  const onLogin = async (data: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) alert("Error al iniciar sesión: " + e.message);
    }
  };

  const handleSocialLogin = async (
    provider: typeof googleProvider | typeof facebookProvider
  ) => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
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
        Inicia sesión en tu cuenta
      </Typography>

      <form onSubmit={form.handleSubmit(onLogin)}>
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

        <Box sx={{ mb: 4 }}>
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
          Iniciar Sesión
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
            "& a": {
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          ¿No tienes cuenta?{" "}
          <Box
            component="span"
            onClick={() => router.push("/signUp")}
            sx={{
              cursor: "pointer",
              color: "#01c4e7",
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Regístrate
          </Box>
        </Typography>
      </form>
    </Box>
  );
};
