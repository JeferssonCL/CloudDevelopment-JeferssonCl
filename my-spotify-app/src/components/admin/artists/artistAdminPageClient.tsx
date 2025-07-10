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
  FormControlLabel,
  FormGroup,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getArtists,
  addArtist,
  deleteArtist,
  updateArtist,
} from "@/services/artistsService";
import { getGenres } from "@/services/genresService";
import { Artist, Genre } from "@/types/music";
import {
  CldUploadWidget,
  CldImage,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

const AdminArtistsPanel = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    genreIds: [] as string[],
    isVerified: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, genresData] = await Promise.all([
          getArtists(),
          getGenres(),
        ]);
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
    setCurrentArtist(null);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      genreIds: [],
      isVerified: false,
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (artist: Artist) => {
    setCurrentArtist(artist);
    setFormData({
      name: artist.name,
      description: artist.description,
      imageUrl: artist.imageUrl,
      genreIds: [...artist.genreIds],
      isVerified: artist.isVerified,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGenreChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      genreIds: Array.isArray(value) ? value : [value],
    });
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      const info = result.info as { secure_url: string };
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageUrl: info.secure_url,
      }));
    }
  };

  const handleQueuesStart = () => {
    setUploading(true);
  };

  const handleQueuesEnd = () => {
    setUploading(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        setSnackbar({
          open: true,
          message: "El nombre del artista es obligatorio",
          severity: "error",
        });
        return;
      }

      if (currentArtist) {
        await updateArtist(currentArtist.id, formData);
        setArtists(
          artists.map((a) =>
            a.id === currentArtist.id ? { ...a, ...formData } : a
          )
        );
        setSnackbar({
          open: true,
          message: "Artista actualizado exitosamente",
          severity: "success",
        });
      } else {
        const newArtistId = await addArtist(formData);
        setArtists([...artists, { id: newArtistId, ...formData }]);
        setSnackbar({
          open: true,
          message: "Artista creado exitosamente",
          severity: "success",
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving artist:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar el artista",
        severity: "error",
      });
    }
  };

  const handleDelete = async (artistId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este artista?")) {
      try {
        await deleteArtist(artistId);
        setArtists(artists.filter((a) => a.id !== artistId));
        setSnackbar({
          open: true,
          message: "Artista eliminado exitosamente",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting artist:", error);
        setSnackbar({
          open: true,
          message: "Error al eliminar el artista",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  const getGenreNames = (genreIds: string[]) => {
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

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
            Administración de Artistas
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
            Nuevo Artista
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="artists table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Géneros
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Verificado
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Imagen
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artists.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{ textAlign: "center", color: "white", py: 4 }}
                  >
                    No hay artistas disponibles
                  </TableCell>
                </TableRow>
              ) : (
                artists.map((artist) => (
                  <TableRow
                    key={artist.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>{artist.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {getGenreNames(artist.genreIds) || "Sin géneros"}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {artist.isVerified ? "Sí" : "No"}
                    </TableCell>
                    <TableCell>
                      {artist.imageUrl ? (
                        <Box
                          component="img"
                          src={artist.imageUrl}
                          alt={artist.name}
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
                        onClick={() => handleOpenEditDialog(artist)}
                        sx={{ color: "#01c4e7" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(artist.id)}
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
          {currentArtist ? "Editar Artista" : "Agregar Nuevo Artista"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#121212", pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre del Artista"
              name="name"
              value={formData.name}
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
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              name="description"
              value={formData.description}
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

            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                    name="isVerified"
                    sx={{ color: "white" }}
                  />
                }
                label={
                  <Typography sx={{ color: "white" }}>
                    Artista verificado
                  </Typography>
                }
              />
            </FormGroup>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ color: "white", mb: 1 }}>
                Imagen del Artista
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
                    Eliminar Imagen
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
                  onSuccess={handleUploadSuccess}
                  onQueuesStart={handleQueuesStart}
                  onQueuesEnd={handleQueuesEnd}
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
                      {uploading ? "Subiendo..." : "Subir Imagen"}
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
            {currentArtist ? "Actualizar" : "Guardar"}
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

export default AdminArtistsPanel;
