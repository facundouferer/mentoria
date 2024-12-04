"use client";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  InputBase,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const pages = [
  { title: "Inicio", path: "/" },
  { title: "FUTURO", path: "https://futuro.chaco.gob.ar/" },
  { title: "ELE", path: "https://ele.chaco.gob.ar/" },
  { title: "CHATBOT", path: "https://bot.scyt.gar.com.ar/" },
];

export default function Navbar({ mode, toggleColorMode }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      router.push(path);
    }
    handleCloseNavMenu();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const searchQuery = encodeURIComponent(searchTerm.trim());
      if (searchQuery) {
        router.push(`/?search=${searchQuery}`);
        setSearchTerm("");
      }
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        height: 81,
      }}
    >
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        <Toolbar
          disableGutters
          sx={{
            height: "100%", // Full height to match the AppBar
            display: "flex", // Ensure it's a flex container
            alignItems: "center", // Center items vertically
          }}
        >
          {/* Logo/Title - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TutorIA
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.path}
                  onClick={() => handleNavigate(page.path)}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo/Title - Mobile */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TutorIA
          </Typography>

          {/* Desktop menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.path}
                onClick={() => handleNavigate(page.path)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Search Box */}
          <Box
            sx={{
              position: "relative",
              backgroundColor: alpha("#fff", 0.15),
              "&:hover": { backgroundColor: alpha("#fff", 0.25) },
              borderRadius: 1,
              marginLeft: 2,
              width: "auto",
            }}
          >
            <Box
              sx={{
                padding: "0 16px",
                height: "100%",
                position: "absolute",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              sx={{
                color: "inherit",
                padding: "8px 8px 8px 48px",
                width: "100%",
                "& input": {
                  color: "inherit",
                  padding: "4px",
                  width: "200px",
                },
              }}
            />
          </Box>

          {/* Theme Toggle */}
          <ThemeToggle mode={mode} toggleColorMode={toggleColorMode} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
