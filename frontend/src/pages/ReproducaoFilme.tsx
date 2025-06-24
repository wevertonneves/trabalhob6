import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../styles/styles.css";

const ReproducaoFilme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    const buscarFilme = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.warn(
          "⚠️ Token ou userId não encontrado. Usuário não autenticado."
        );
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`/api/filmes/${id}`, { headers });
        setFilme(response.data);

        const favoritosRes = await axios.get(`/api/favoritos/${userId}`, {
          headers,
        });
        const idsFavoritos = favoritosRes.data.map(
          (fav: any) => fav.favorito?.filmeId
        );
        setIsFavorito(idsFavoritos.includes(Number(id)));
      } catch (err) {
        console.error("❌ Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarFilme();
  }, [id]);

  const alternarFavorito = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Usuário não autenticado");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (isFavorito) {
        await axios.post(
          "/api/favoritos/remover",
          { userId, filmeId: id },
          { headers }
        );
        setIsFavorito(false);
      } else {
        await axios.post(
          "/api/favoritos/adicionar",
          { userId, filmeId: id },
          { headers }
        );
        setIsFavorito(true);
      }
    } catch (error) {
      console.error("❌ Erro ao favoritar/desfavoritar:", error);
    }
  };

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!filme) {
    return <Typography variant="h6">Filme não encontrado.</Typography>;
  }

  return (
    <Box className="reproducao-container">
      <div className="reproducao-header">
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          className="btn-voltar"
        >
          Voltar
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={isFavorito ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={alternarFavorito}
          className="btn-curtir"
        >
          Curtir
        </Button>
      </div>

      <Typography variant="h4" gutterBottom className="reproducao-titulo">
        {filme.name}
      </Typography>

      <div className="video-wrapper">
        <video controls autoPlay>
          <source src={filme.videoUrl} type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      </div>

      <Typography className="reproducao-sinopse">
        <strong>Sinopse:</strong> {filme.sinopse}
      </Typography>
    </Box>
  );
};

export default ReproducaoFilme;
