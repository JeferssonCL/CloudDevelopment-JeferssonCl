"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Chip,
  LinearProgress,
} from "@mui/material";
import { getSongById, getArtist } from "@/services/firestore";
import { Song, Artist } from "@/types/music";
import { useRouter } from "next/navigation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";

interface SongPageProps {
  songId: string;
}

const SongPlayerPage = ({ songId }: SongPageProps) => {
  const [song, setSong] = useState<Song | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const songData = await getSongById(songId);
        if (!songData) {
          router.push("/");
          return;
        }
        setSong(songData);

        const artistData = await getArtist(songData.artistId);
        setArtist(artistData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [songId, router]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = (clickPosition / rect.width) * 100;
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ color: "white", textAlign: "center", py: 10 }}
      >
        <Typography variant="h6">Cargando canción...</Typography>
      </Container>
    );
  }

  if (!song) {
    return (
      <Container
        maxWidth="lg"
        sx={{ color: "white", textAlign: "center", py: 10 }}
      >
        <Typography variant="h6">Canción no encontrada</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, color: "white" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 6,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "300px" },
            maxWidth: { xs: "400px", md: "none" },
          }}
        >
          <Avatar
            src={song.imageUrl}
            alt={song.title}
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

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            {song.title}
          </Typography>

          {artist && (
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 3,
                color: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  color: "#01c4e7",
                  cursor: "pointer",
                  textDecoration: "underline",
                },
              }}
              onClick={() => router.push(`/artists/${artist.id}`)}
            >
              {artist.name}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip
              label={formatTime(song.duration)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            />
            <Chip
              label={`Lanzado: ${new Date(song.createdAt).getFullYear()}`}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <IconButton onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? (
                <FavoriteIcon sx={{ color: "#1DB954", fontSize: 30 }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "white", fontSize: 30 }} />
              )}
            </IconButton>
            <IconButton>
              <ShareIcon sx={{ color: "white", fontSize: 30 }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          p: 3,
          mb: 6,
        }}
      >
        <Box sx={{ mb: 2, cursor: "pointer" }} onClick={handleProgressClick}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#01c4e7",
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="caption">
              {audioRef.current
                ? formatTime(audioRef.current.currentTime)
                : "0:00"}
            </Typography>
            <Typography variant="caption">
              {formatTime(song.duration)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <IconButton sx={{ color: "white" }}>
            <SkipPreviousIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <IconButton
            onClick={togglePlay}
            sx={{
              color: "white",
              backgroundColor: "#01c4e7",
              "&:hover": {
                backgroundColor: "#01a8c7",
                transform: "scale(1.1)",
              },
              width: 70,
              height: 70,
            }}
          >
            {isPlaying ? (
              <PauseIcon sx={{ fontSize: 40 }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: 40 }} />
            )}
          </IconButton>

          <IconButton sx={{ color: "white" }}>
            <SkipNextIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

        <audio
          ref={audioRef}
          src={song.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          hidden
        />
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Más sobre esta canción
        </Typography>
        <Typography paragraph sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Disfruta de esta canción en alta calidad. Puedes agregarla a tus
          favoritos o compartirla con tus amigos.
        </Typography>
      </Box>
    </Container>
  );
};

export default SongPlayerPage;
