"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, IconButton, Container } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  MusicNote,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "black",
        color: "#ffffff",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
        borderTop: "1px solid #282828",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
            mb: 4,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MusicNote sx={{ color: "#01c4e7", fontSize: "2rem", mr: 1 }} />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "#01c4e7" }}
              >
                Music Hall
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#b3b3b3", mb: 2 }}>
              La mejor plataforma para descubrir música, crear playlists y
              conectar con artistas.
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: "#ffffff" }}
            >
              Navegación
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {[
                { name: "Inicio", href: "/" },
                { name: "Explorar", href: "/explore" },
                { name: "Biblioteca", href: "/library" },
                { name: "Premium", href: "/premium" },
              ].map((item) => (
                <Box component="li" key={item.name} sx={{ mb: 1 }}>
                  <Link
                    href={item.href}
                    style={{
                      color: "#b3b3b3",
                      textDecoration: "none",
                    }}
                  >
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: "#ffffff" }}
            >
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {[
                { name: "Términos y condiciones", href: "/terms" },
                { name: "Política de privacidad", href: "/privacy" },
                { name: "Cookies", href: "/cookies" },
                { name: "Aviso legal", href: "/legal" },
              ].map((item) => (
                <Box component="li" key={item.name} sx={{ mb: 1 }}>
                  <Link
                    href={item.href}
                    style={{ color: "#b3b3b3", textDecoration: "none" }}
                  >
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Columna 4 - Redes sociales */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: "#ffffff" }}
            >
              Síguenos
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                href="https://facebook.com"
                aria-label="Facebook"
                sx={{
                  color: "#b3b3b3",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(29, 174, 185, 0.2)",
                    color: "#01c4e7",
                  },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                aria-label="Twitter"
                sx={{
                  color: "#b3b3b3",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(29, 174, 185, 0.2)",
                    color: "#01c4e7",
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                aria-label="Instagram"
                sx={{
                  color: "#b3b3b3",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(29, 174, 185, 0.2)",
                    color: "#01c4e7",
                  },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                aria-label="LinkedIn"
                sx={{
                  color: "#b3b3b3",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(29, 174, 185, 0.2)",
                    color: "#01c4e7",
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Línea divisoria y copyright */}
        <Box
          sx={{
            borderTop: "1px solid #282828",
            pt: 3,
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#b3b3b3" }}>
            © {new Date().getFullYear()} Spotufy AB. Todos los derechos
            reservados.
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "#b3b33b" }}>
              <Link
                href="/privacy"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Privacidad
              </Link>
            </Typography>
            <Typography variant="caption" sx={{ color: "#b3b3b3" }}>
              <Link
                href="/terms"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Términos
              </Link>
            </Typography>
            <Typography variant="caption" sx={{ color: "#b3b3b3" }}>
              <Link
                href="/cookies"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Cookies
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
