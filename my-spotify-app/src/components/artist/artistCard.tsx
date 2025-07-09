"use client";

import React from "react";
import { CardMedia, Typography, Box, Avatar, useTheme } from "@mui/material";
import { Artist } from "@/types/music";
import { useRouter } from "next/navigation";
import VerifiedIcon from "@mui/icons-material/Verified";

interface ArtistCardProps {
  artist: Artist;
  baseRoute?: string;
}

const ArtistCard = ({ artist, baseRoute = "/artists" }: ArtistCardProps) => {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    router.push(`${baseRoute}/${artist.id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 200,
        cursor: "pointer",
        "&:hover .artist-image": {
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
        },
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          position: "relative",
          width: 160,
          height: 160,
          borderRadius: "50%",
          overflow: "hidden",
          mb: 1.5,
          transition: "all 0.3s ease",
        }}
        className="artist-image"
      >
        <CardMedia
          component="img"
          image={artist.imageUrl}
          alt={artist.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {artist.isVerified && (
          <Avatar
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 28,
              height: 28,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
            }}
          >
            <VerifiedIcon sx={{ fontSize: 16 }} />
          </Avatar>
        )}
      </Box>

      <Box
        sx={{
          textAlign: "center",
          width: "100%",
          px: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          fontWeight="600"
          color="white"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {artist.name}
          {artist.isVerified && (
            <VerifiedIcon
              color="primary"
              sx={{
                fontSize: "1rem",
                verticalAlign: "middle",
              }}
            />
          )}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.5,
          }}
        >
          Artista
        </Typography>
      </Box>
    </Box>
  );
};

export default ArtistCard;
