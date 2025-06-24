import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import axios from "axios";

const Layout = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuário";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [termoBusca, setTermoBusca] = useState("");
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
    handleMenuClose();
  };

  const handlePerfil = () => {
    navigate("/perfil");
    handleMenuClose();
  };

  const handleFavoritos = () => {
    navigate("/favoritos");
    handleMenuClose();
  };

  const handleSelecionarFilme = (filmeId: number) => {
    setMostrarResultados(false);
    setTermoBusca("");
    navigate(`/filmes/${filmeId}`);
  };

  const handleClickAway = () => {
    setMostrarResultados(false);
  };

  const handleChangeBusca = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setTermoBusca(value);

    if (value.length > 0) {
      try {
        const response = await axios.get(`api/filmes/search?nome=${value}`);
        setResultadosBusca([response.data]);
        setMostrarResultados(true);
      } catch {
        setResultadosBusca([]);
        setMostrarResultados(true);
      }
    } else {
      setResultadosBusca([]);
      setMostrarResultados(false);
    }
  };

  return (
    <Box className="layout-container">
      <AppBar position="fixed" className="app-bar">
        <Toolbar className="toolbar" sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            onClick={() => navigate("/home")}
            className="logo-box"
            sx={{ cursor: "pointer" }}
          >
            <img src="/logo.png" alt="GAMBY FLIX Logo" className="logo-img" />
          </Box>

          {/* Pesquisa + Usuário */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Barra de Pesquisa */}
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ position: "relative", width: 250 }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Buscar filmes..."
                  value={termoBusca}
                  onChange={handleChangeBusca}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                  onFocus={() => {
                    if (resultadosBusca.length > 0) setMostrarResultados(true);
                  }}
                />

                {mostrarResultados && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: "absolute",
                      width: "100%",
                      zIndex: 10,
                      maxHeight: 200,
                      overflowY: "auto",
                    }}
                  >
                    <List>
                      {resultadosBusca.length > 0 ? (
                        resultadosBusca.map((filme) => (
                          <ListItem
                            key={filme.id}
                            component="button"
                            onClick={() => handleSelecionarFilme(filme.id)}
                          >
                            <ListItemText primary={filme.name} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="Filme não encontrado." />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>

            {/* Usuário */}
            <Box
              className="user-box"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <IconButton onClick={handleMenuOpen}>
                <Avatar className="user-avatar">
                  <PersonIcon />
                </Avatar>
              </IconButton>
              <Typography variant="body1" className="user-name" sx={{ ml: 1 }}>
                Olá, <strong>{username}</strong>
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handlePerfil}>Ver Perfil</MenuItem>
                <MenuItem onClick={handleFavoritos}>Favoritos</MenuItem>
                <MenuItem onClick={handleAdminPanel}>
                  Painel Administrativo
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Espaçador da AppBar */}
      <Toolbar className="appbar-spacer" />

      {/* Conteúdo principal */}
      <Box component="main" className="main-content">
        <Outlet />
      </Box>

      {/* Footer */}
      <Box component="footer" className="footer">
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} GAMBY FLIX. Todos os direitos
          reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
