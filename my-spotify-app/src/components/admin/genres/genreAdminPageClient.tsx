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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getGenres,
  addGenre,
  deleteGenre,
  updateGenre,
} from "@/services/genresService";
import { Genre } from "@/types/music";
import {
  CldUploadWidget,
  CldImage,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

const AdminGenresPanel = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentGenre, setCurrentGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    desciption: "",
    imageUrl: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los géneros",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleOpenAddDialog = () => {
    setCurrentGenre(null);
    setFormData({
      name: "",
      desciption: "",
      imageUrl: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (genre: Genre) => {
    setCurrentGenre(genre);
    setFormData({
      name: genre.name,
      desciption: genre.desciption,
      imageUrl: genre.imageUrl,
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
      [name]: value,
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
          message: "El nombre del género es obligatorio",
          severity: "error",
        });
        return;
      }

      if (currentGenre) {
        await updateGenre(currentGenre.id, formData);
        setGenres(
          genres.map((g) =>
            g.id === currentGenre.id ? { ...g, ...formData } : g
          )
        );
        setSnackbar({
          open: true,
          message: "Género actualizado exitosamente",
          severity: "success",
        });
      } else {
        const newGenreId = await addGenre(formData);
        setGenres([...genres, { id: newGenreId, ...formData }]);
        setSnackbar({
          open: true,
          message: "Género creado exitosamente",
          severity: "success",
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving genre:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar el género",
        severity: "error",
      });
    }
  };

  const handleDelete = async (genreId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este género?")) {
      try {
        await deleteGenre(genreId);
        setGenres(genres.filter((g) => g.id !== genreId));
        setSnackbar({
          open: true,
          message: "Género eliminado exitosamente",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting genre:", error);
        setSnackbar({
          open: true,
          message: "Error al eliminar el género",
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
            Administración de Géneros
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
            Nuevo Género
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="genres table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Descripción
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
              {genres.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ textAlign: "center", color: "white", py: 4 }}
                  >
                    No hay géneros disponibles
                  </TableCell>
                </TableRow>
              ) : (
                genres.map((genre) => (
                  <TableRow
                    key={genre.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>{genre.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {genre.desciption || "Sin descripción"}
                    </TableCell>
                    <TableCell>
                      {genre.imageUrl ? (
                        <Box
                          component="img"
                          src={genre.imageUrl}
                          alt={genre.name}
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
                        onClick={() => handleOpenEditDialog(genre)}
                        sx={{ color: "#01c4e7" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(genre.id)}
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
          {currentGenre ? "Editar Género" : "Agregar Nuevo Género"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#121212", pt: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre del Género"
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
              name="desciption"
              value={formData.desciption}
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
                Imagen del Género
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
            {currentGenre ? "Actualizar" : "Guardar"}
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

export default AdminGenresPanel;
