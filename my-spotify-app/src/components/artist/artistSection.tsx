"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Slider from "react-slick";
import ArtistCard from "./artistCard";
import { Artist } from "@/types/music";
import { getArtists } from "@/services/firestore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArtistListProps {
  genreId?: string | null;
}

const ArtistList: React.FC<ArtistListProps> = ({ genreId = null }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const data = await getArtists(genreId);
        setArtists(data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [genreId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Container maxWidth={false} sx={{ pt: 8, pb: 4, px: 8 }}>
      <Typography
        color="white"
        sx={{
          fontSize: { xs: "0.5rem", md: "1rem", lg: "0.5rem" },
          fontWeight: 700,
          mb: 3,
          pl: 1,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Artistas populares
      </Typography>

      <Box sx={{ mt: 3, overflow: "visible", position: "relative", px: 4 }}>
        {loading ? (
          <Typography color="white">Cargando artistas...</Typography>
        ) : artists.length === 0 ? (
          <Typography color="white">No se encontraron artistas.</Typography>
        ) : (
          <Slider {...settings}>
            {artists.map((artist) => (
              <Box key={artist.id} sx={{ px: 1 }}>
                <ArtistCard artist={artist} />
              </Box>
            ))}
          </Slider>
        )}
      </Box>
    </Container>
  );
};

export default ArtistList;
