"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { getArtist, getSongsByArtist, getGenres } from "@/services/firestore";
import { Artist, Song, Genre } from "@/types/music";
import { useRouter } from "next/navigation";
import SongCard from "@/components/music/musicCard";

interface ArtistClientPageProps {
  artistId: string;
}

const ArtistClientPage = ({ artistId }: ArtistClientPageProps) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener el artista específico
        const artistData = await getArtist(artistId);
        if (!artistData) {
          router.push("/artists");
          return;
        }
        setArtist(artistData);

        // Obtener canciones del artista
        const artistSongs = await getSongsByArtist(artistId);
        setSongs(artistSongs);

        // Obtener todos los géneros y filtrar los del artista
        const allGenres = await getGenres();
        const artistGenres = allGenres.filter((genre) =>
          artistData.genreIds.includes(genre.id)
        );
        setGenres(artistGenres);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId, router]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ color: "white" }}>
        <Typography variant="h6">Cargando...</Typography>
      </Container>
    );
  }

  if (!artist) {
    return (
      <Container maxWidth="lg" sx={{ color: "white" }}>
        <Typography variant="h6">Artista no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, color: "white" }}>
      {/* Sección superior: Imagen e información del artista */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 4,
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        {/* Imagen del artista - Lado izquierdo */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "300px" },
            maxWidth: { xs: "400px", md: "none" },
          }}
        >
          <Avatar
            src={artist.imageUrl}
            alt={artist.name}
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

        {/* Información del artista - Lado derecho */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              {artist.name}
            </Typography>
            {artist.isVerified && (
              <Chip
                label="Verificado"
                size="small"
                sx={{
                  backgroundColor: "rgba(29, 185, 84, 0.2)",
                  color: "#1DB954",
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
              maxWidth: "800px",
            }}
          >
            {artist.description}
          </Typography>

          {/* Sección de géneros */}
          {genres.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Géneros:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    onClick={() => router.push(`/genres/${genre.id}`)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                      mb: 1,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              label={`${songs.length} canciones`}
              sx={{
                backgroundColor: "rgba(1, 196, 231, 0.2)",
                color: "#01c4e7",
                fontWeight: "bold",
                fontSize: "0.9rem",
                px: 1.5,
                py: 1,
              }}
            />
            <Chip
              label={`${genres.length} géneros`}
              sx={{
                backgroundColor: "rgba(156, 39, 176, 0.2)",
                color: "#9C27B0",
                fontWeight: "bold",
                fontSize: "0.9rem",
                px: 1.5,
                py: 1,
              }}
            />
          </Box>
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

      {/* Sección de canciones */}
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
          Canciones populares
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default ArtistClientPage;
