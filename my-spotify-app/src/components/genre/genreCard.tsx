"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Genre } from "@/types/music";
import { useRouter } from "next/navigation";

interface GenreCardProps {
  genre: Genre;
}

const GenreCard = ({ genre }: GenreCardProps) => {
  const router = useRouter();
  const [songCount, setSongCount] = useState<number | null>(null);

  useEffect(() => {
    const count = Math.floor(Math.random() * 500) + 100;
    setSongCount(count);
  }, []);

  const getColorByGenreId = (id: string) => {
    const colors = [
      "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
      "linear-gradient(135deg, #10B981 0%, #047857 100%)",
      "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
      "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
      "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    ];
    const numericId = parseInt(id.replace(/\D/g, "")) || 0;
    return colors[numericId % colors.length];
  };

  return (
    <Card
      onClick={() => router.push(`/genres/${genre.id}/artists`)}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        },
        background: getColorByGenreId(genre.id),
      }}
    >
      <CardActionArea sx={{ height: "100%" }}>
        <Box
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <CardMedia
            component="img"
            height="100%"
            image={genre.imageUrl}
            alt={genre.name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 1,
              mixBlendMode: "overlay",
            }}
          />

          <CardContent
            sx={{
              position: "relative",
              zIndex: 2,
              color: "common.white",
              p: 3,
            }}
          >
            <Typography
              variant="h5"
              component="div"
              fontWeight="bold"
              sx={{
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                mb: 1,
              }}
            >
              {genre.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label="Popular"
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  backdropFilter: "blur(4px)",
                }}
              />
              {songCount !== null && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.88)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {songCount} canciones
                </Typography>
              )}
            </Box>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default GenreCard;
