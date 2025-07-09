"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Slider from "react-slick";
import GenreCard from "./genreCard";
import { Genre } from "@/types/music";
import { getGenres } from "@/services/firestore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

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
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
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
        Explora por género
      </Typography>

      <Box sx={{ mt: 3, overflow: "visible", position: "relative", px: 4 }}>
        {loading ? (
          <Typography color="white">Cargando géneros...</Typography>
        ) : genres.length === 0 ? (
          <Typography color="white">No se encontraron géneros.</Typography>
        ) : (
          <Slider {...settings}>
            {genres.map((genre) => (
              <Box key={genre.id} sx={{ px: 1 }}>
                <GenreCard genre={genre} />
              </Box>
            ))}
          </Slider>
        )}
      </Box>
    </Container>
  );
};

export default GenreList;
