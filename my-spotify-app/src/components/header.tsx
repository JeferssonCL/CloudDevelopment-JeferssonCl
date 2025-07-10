"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/credentials";

export default function MenuAppBar() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(auth);
    console.log("Cerrar sesión");
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "black", pl: 2, pr: 2, pt: 1, pb: 1 }}
      >
        <Toolbar>
          <Box
            onClick={() => router.push("/")}
            sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
          >
            <Image
              src="https://i.postimg.cc/sxjdWdcK/Whats-App-Image-2025-07-09-at-14-25-55.jpgg"
              alt="Music Hall Logo"
              width={40}
              height={40}
              style={{ marginRight: "10px" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              Music Hall
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {user && (
              <Button
                onClick={handleMenu}
                color="inherit"
                startIcon={<AccountCircle />}
                sx={{
                  textTransform: "none",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {user.displayName}
              </Button>
            )}

            {!user && (
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  textTransform: "none",
                }}
                onClick={() => router.push("/signIn")}
              >
                Registrarse
              </Button>
            )}
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            disableScrollLock={true}
            disableEnforceFocus={false}
            disableAutoFocus={false}
            disableRestoreFocus={false}
          >
            <MenuItem
              onClick={() => {
                router.push("/admin/songs");
                handleClose();
              }}
            >
              Administrar canciones
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/admin/artists");
                handleClose();
              }}
            >
              Administrar artistas
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/admin/genres");
                handleClose();
              }}
            >
              Administrar géneros
            </MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
