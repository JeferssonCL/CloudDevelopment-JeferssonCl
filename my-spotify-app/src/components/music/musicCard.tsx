"use client";

import React from "react";
import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import { Song } from "@/types/music";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useRouter } from "next/navigation";

interface SongCardProps {
  song: Song;
  isPlaying?: boolean;
  onPlayClick?: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const SongCard = ({ song, isPlaying = false, onPlayClick }: SongCardProps) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/songs/${song.id}`)}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        },
        background: "linear-gradient(135deg, #333333 0%, #121212 100%)",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={song.imageUrl}
          alt={song.title}
          sx={{
            width: "100%",
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (onPlayClick) onPlayClick();
            }}
            sx={{
              backgroundColor: "#01c4e7",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#01a8c7",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight="bold"
            color="text.primary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {song.title}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Artista
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {formatDuration(song.duration)}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default SongCard;
