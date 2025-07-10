"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { CldUploadButton } from "next-cloudinary";
import {
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { Genre } from "@/types/music";

interface GenreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Genre, "id">) => void;
  currentGenre?: Genre | null;
}

const GenreDialog: React.FC<GenreDialogProps> = ({
  open,
  onClose,
  onSubmit,
  currentGenre,
}) => {
  const [formData, setFormData] = useState<Omit<Genre, "id">>({
    name: currentGenre?.name || "",
    desciption: currentGenre?.desciption || "",
    imageUrl: currentGenre?.imageUrl || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    setUploading(false);
    const info = result.info as CloudinaryUploadWidgetInfo;

    if (info?.secure_url) {
      setFormData({ ...formData, imageUrl: info.secure_url });
    }
  };

  const handleUploadError = () => {
    setUploading(false);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
        {currentGenre ? "Editar Género" : "Agregar Nuevo Género"}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#1e1e1e" }}>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            sx={{
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": { borderColor: "#01c4e7" },
              },
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Descripción"
            name="desciption"
            multiline
            rows={4}
            value={formData.desciption}
            onChange={handleInputChange}
            sx={{
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": { borderColor: "#01c4e7" },
              },
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="URL de la imagen"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CldUploadButton
                    uploadPreset="genre_images"
                    onUpload={() => setUploading(true)}
                    onSuccess={handleUploadSuccess}
                    onError={handleUploadError}
                    options={{
                      sources: ["local", "url"],
                      multiple: false,
                      cropping: true,
                      croppingAspectRatio: 1,
                      showAdvancedOptions: true,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<CloudUpload />}
                      disabled={uploading}
                      sx={{
                        backgroundColor: "#01c4e7",
                        "&:hover": { backgroundColor: "#01a8c7" },
                      }}
                    >
                      {uploading ? "Subiendo..." : "Subir imagen"}
                    </Button>
                  </CldUploadButton>
                </InputAdornment>
              ),
              sx: {
                color: "white !important",
                "& input.Mui-disabled": {
                  color: "white !important",
                  WebkitTextFillColor: "white !important",
                  opacity: 1,
                },
              },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "white !important",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.7) !important",
                },
              },
              "& .MuiOutlinedInput-root": {
                "& input": {
                  color: "white !important",
                },
                "& input.Mui-disabled": {
                  color: "white !important",
                  WebkitTextFillColor: "white !important",
                  opacity: 1,
                },
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3) !important",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5) !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#01c4e7 !important",
                },
                "&.Mui-disabled fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3) !important",
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
        <Button onClick={onClose} sx={{ color: "white" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "#01c4e7", color: "white" }}
        >
          {currentGenre ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenreDialog;
