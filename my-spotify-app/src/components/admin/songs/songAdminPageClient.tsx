"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getSongs,
  addSong,
  deleteSong,
  updateSong,
} from "@/services/songsService";
import { getArtists } from "@/services/artistsService";
import { getGenres } from "@/services/genresService";
import { Song, Artist, Genre } from "@/types/music";
import {
  CldUploadWidget,
  CldImage,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

const AdminSongsPanel = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    genreIds: [] as string[],
    duration: 0,
    audioUrl: "",
    imageUrl: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [uploading, setUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, artistsData, genresData] = await Promise.all([
          getSongs(),
          getArtists(),
          getGenres(),
        ]);
        setSongs(songsData);
        setArtists(artistsData);
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los datos",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenAddDialog = () => {
    setCurrentSong(null);
    setFormData({
      title: "",
      artistId: "",
      genreIds: [],
      duration: 0,
      audioUrl: "",
      imageUrl: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (song: Song) => {
    setCurrentSong(song);
    setFormData({
      title: song.title,
      artistId: song.artistId,
      genreIds: [...song.genreIds],
      duration: song.duration,
      audioUrl: song.audioUrl,
      imageUrl: song.imageUrl,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "duration" ? Number(value) : value,
    });
  };

  const handleArtistChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      artistId: e.target.value,
    });
  };

  const handleGenreChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      genreIds: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleImageUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      const info = result.info as { secure_url: string };
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageUrl: info.secure_url,
      }));
    }
    setUploading(false);
  };

  const handleAudioUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      const info = result.info as { secure_url: string };
      setFormData((prevFormData) => ({
        ...prevFormData,
        audioUrl: info.secure_url,
      }));
    }
    setAudioUploading(false);
  };

  const handleUploadStart = () => {
    setUploading(true);
  };

  const handleAudioUploadStart = () => {
    setAudioUploading(true);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title.trim()) {
        setSnackbar({
          open: true,
          message: "El título de la canción es obligatorio",
          severity: "error",
        });
        return;
      }

      if (!formData.artistId) {
        setSnackbar({
          open: true,
          message: "Debes seleccionar un artista",
          severity: "error",
        });
        return;
      }

      if (formData.genreIds.length === 0) {
        setSnackbar({
          open: true,
          message: "Debes seleccionar al menos un género",
          severity: "error",
        });
        return;
      }

      if (!formData.audioUrl) {
        setSnackbar({
          open: true,
          message: "Debes subir un archivo de audio",
          severity: "error",
        });
        return;
      }

      if (currentSong) {
        await updateSong(currentSong.id, formData);
        setSongs(
          songs.map((s) =>
            s.id === currentSong.id ? { ...s, ...formData } : s
          )
        );
        setSnackbar({
          open: true,
          message: "Canción actualizada exitosamente",
          severity: "success",
        });
      } else {
        const newSong = {
          ...formData,
          createdAt: new Date(),
        };
        const newSongId = await addSong(newSong);
        setSongs([...songs, { id: newSongId, ...newSong }]);
        setSnackbar({
          open: true,
          message: "Canción creada exitosamente",
          severity: "success",
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving song:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar la canción",
        severity: "error",
      });
    }
  };

  const handleDelete = async (songId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta canción?")) {
      try {
        await deleteSong(songId);
        setSongs(songs.filter((s) => s.id !== songId));
        setSnackbar({
          open: true,
          message: "Canción eliminada exitosamente",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting song:", error);
        setSnackbar({
          open: true,
          message: "Error al eliminar la canción",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getArtistName = (artistId: string) => {
    return (
      artists.find((a) => a.id === artistId)?.name || "Artista desconocido"
    );
  };

  const getGenreNames = (genreIds: string[] | undefined) => {
    if (!genreIds || !Array.isArray(genreIds)) {
      return "Sin géneros";
    }

    return (
      genreIds
        .map((id) => genres.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join(", ") || "Sin géneros"
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <Box
        sx={{
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          p: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.36)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "white" }}
          >
            Administración de Canciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: "#01c4e7",
              "&:hover": { backgroundColor: "#01a8c7" },
            }}
          >
            Nueva Canción
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="songs table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Título
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Artista
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Géneros
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Duración (seg)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Portada
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", color: "white", py: 4 }}
                  >
                    No hay canciones disponibles
                  </TableCell>
                </TableRow>
              ) : (
                songs.map((song) => (
                  <TableRow
                    key={song.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>{song.title}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {getArtistName(song.artistId)}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {getGenreNames(song.genreIds) || "Sin géneros"}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {song.duration}
                    </TableCell>
                    <TableCell>
                      {song.imageUrl ? (
                        <Box
                          component="img"
                          src={song.imageUrl}
                          alt={song.title}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "10px",
                            textAlign: "center",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          Sin imagen
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenEditDialog(song)}
                        sx={{ color: "#01c4e7" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(song.id)}
                        sx={{ color: "#f44336" }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: "white", backgroundColor: "#121212" }}>
          {currentSong ? "Editar Canción" : "Agregar Nueva Canción"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#121212", pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": { borderColor: "white" },
                },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: "white" }}>Artista</InputLabel>
              <Select
                value={formData.artistId}
                onChange={handleArtistChange}
                label="Artista"
                sx={{
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                    "&:hover fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputBase-input": { color: "white" },
                }}
              >
                {artists.map((artist) => (
                  <MenuItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: "white" }}>Géneros</InputLabel>
              <Select
                multiple
                value={formData.genreIds}
                onChange={handleGenreChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          genres.find((g) => g.id === value)?.name || value
                        }
                        sx={{ color: "white" }}
                      />
                    ))}
                  </Box>
                )}
                sx={{
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                    "&:hover fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputBase-input": { color: "white" },
                }}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    <Checkbox
                      checked={formData.genreIds.indexOf(genre.id) > -1}
                      sx={{ color: "white" }}
                    />
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              label="Duración (segundos)"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              sx={{
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": { borderColor: "white" },
                },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ color: "white", mb: 1 }}>
                Archivo de Audio
              </Typography>

              {formData.audioUrl ? (
                <>
                  <audio
                    controls
                    style={{ width: "100%", marginBottom: "16px" }}
                  >
                    <source src={formData.audioUrl} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setFormData({ ...formData, audioUrl: "" })}
                    sx={{ ml: 2 }}
                  >
                    Eliminar Audio
                  </Button>
                </>
              ) : (
                <CldUploadWidget
                  uploadPreset="audio_preset"
                  options={{
                    sources: ["local"],
                    multiple: false,
                    resourceType: "video",
                    clientAllowedFormats: ["mp3", "wav", "ogg"],
                    maxFileSize: 10000000,
                  }}
                  onSuccess={handleAudioUploadSuccess}
                  onQueuesStart={handleAudioUploadStart}
                >
                  {({ open }) => (
                    <Button
                      variant="contained"
                      onClick={() => open()}
                      disabled={audioUploading}
                      startIcon={
                        audioUploading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Add />
                        )
                      }
                    >
                      {audioUploading ? "Subiendo audio..." : "Subir Audio"}
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ color: "white", mb: 1 }}>
                Portada de la Canción
              </Typography>

              {formData.imageUrl ? (
                <>
                  <CldImage
                    width="200"
                    height="200"
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{ borderRadius: "8px", marginBottom: "16px" }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    sx={{ ml: 2 }}
                  >
                    Eliminar Portada
                  </Button>
                </>
              ) : (
                <CldUploadWidget
                  uploadPreset="posts_preset"
                  options={{
                    sources: ["local", "url"],
                    multiple: false,
                    cropping: true,
                    croppingAspectRatio: 1,
                    croppingShowBackButton: true,
                  }}
                  onSuccess={handleImageUploadSuccess}
                  onQueuesStart={handleUploadStart}
                >
                  {({ open }) => (
                    <Button
                      variant="contained"
                      onClick={() => open()}
                      disabled={uploading}
                      startIcon={
                        uploading ? <CircularProgress size={20} /> : <Add />
                      }
                    >
                      {uploading ? "Subiendo..." : "Subir Portada"}
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#121212" }}>
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#01c4e7",
              "&:hover": { backgroundColor: "#01a8c7" },
            }}
          >
            {currentSong ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSongsPanel;
