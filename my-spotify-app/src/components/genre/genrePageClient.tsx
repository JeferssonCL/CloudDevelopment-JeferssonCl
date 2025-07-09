"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { getGenres, getArtists } from "@/services/firestore";
import { Genre, Artist } from "@/types/music";
import { useRouter } from "next/navigation";
import ArtistCard from "@/components/artist/artistCard";

interface GenreClientPageProps {
  genreId: string;
}

const GenreClientPage = ({ genreId }: GenreClientPageProps) => {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener el género específico
        const allGenres = await getGenres();
        const foundGenre = allGenres.find((g) => g.id === genreId);

        if (!foundGenre) {
          router.push("/genres");
          return;
        }

        setGenre(foundGenre);

        // Obtener artistas del género
        const genreArtists = await getArtists(genreId);
        setArtists(genreArtists);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId, router]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ color: "white" }}>
        <Typography variant="h6">Cargando...</Typography>
      </Container>
    );
  }

  if (!genre) {
    return (
      <Container maxWidth="lg" sx={{ color: "white" }}>
        <Typography variant="h6">Género no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, color: "white" }}>
      {/* Sección superior: Imagen e información del género */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 4,
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        {/* Imagen del género - Lado izquierdo */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "300px" },
            maxWidth: { xs: "400px", md: "none" },
          }}
        >
          <Avatar
            src={genre.imageUrl}
            alt={genre.name}
            sx={{
              width: "100%",
              height: "auto",
              aspectRatio: "1/1",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
            variant="square"
          />
        </Box>

        {/* Información del género - Lado derecho */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            {genre.name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
              maxWidth: "800px",
            }}
          >
            {genre.desciption}
          </Typography>

          <Chip
            label={`${artists.length} artistas`}
            sx={{
              backgroundColor: "rgba(1, 196, 231, 0.2)",
              color: "#01c4e7",
              fontWeight: "bold",
              fontSize: "0.9rem",
              px: 1.5,
              py: 1,
            }}
          />
        </Box>
      </Box>

      {/* Divisor */}
      <Divider
        sx={{
          my: 4,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: "1px",
        }}
      />

      {/* Sección de artistas */}
      <Box>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 4,
            fontSize: "1.75rem",
          }}
        >
          Artistas destacados
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 3,
          }}
        >
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              baseRoute={`/genres/${genreId}/artists`}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default GenreClientPage;
