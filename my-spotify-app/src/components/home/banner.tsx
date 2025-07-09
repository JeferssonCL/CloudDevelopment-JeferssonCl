"use client";

import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: "300px",
          md: "400px",
          lg: "500px",
        },
        overflow: "hidden",
      }}
    >
      <Image
        src="https://i.postimg.cc/LX7nJLmQ/Whats-App-Image-2025-07-09-at-10-02-15.jpg"
        alt="Banner Image"
        fill
        priority={true}
        style={{ objectFit: "cover" }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: {
            xs: "center",
            lg: "flex-end",
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              lg: "50%",
            },
            p: {
              xs: 2,
              md: 4,
              lg: 5,
            },
            color: "white",
            textAlign: {
              xs: "center",
              lg: "left",
            },
          }}
        >
          <Typography
            variant={isMobile ? "h4" : isLargeScreen ? "h2" : "h3"}
            component="h1"
            fontWeight="bold"
            mb={2}
            sx={{
              maxWidth: 500,
              mx: {
                xs: "auto",
                lg: 0,
              },
            }}
          >
            DESCUBRE TU SONIDO, VIVE LA MÚSICA
          </Typography>

          <Typography
            variant={isMobile ? "body2" : "body1"}
            mb={3}
            sx={{
              maxWidth: 400,
              mx: {
                xs: "auto",
                lg: 0,
              },
            }}
          >
            Explora millones de canciones, crea tus playlists y conecta con tus
            artistas favoritos. Una experiencia musical pensada para ti.
          </Typography>

          <Button
            href="#schedule"
            variant="contained"
            color="primary"
            startIcon={<AccessTimeIcon />}
            sx={{
              px: 3,
              py: 1.5,
              backgroundColor: "grey.800",
              "&:hover": {
                backgroundColor: "grey.700",
              },
              transition: "background-color 0.3s",
            }}
          >
            EMPIEZA A ESCUCHAR
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Banner;
