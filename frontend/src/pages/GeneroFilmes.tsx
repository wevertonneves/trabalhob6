import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../styles/styles.css";

// Interfaces
interface Filme {
  id: number;
  name: string;
  image: string;
  releaseYear: number;
  duration: number;
  videoUrl?: string;
}

interface Genero {
  id: number;
  name: string;
}

interface FavoritoResponse {
  favorito: {
    filmeId: number;
  };
}

const GeneroFilmes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [genero, setGenero] = useState<Genero | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    const fetchDados = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(`/api/genero/${id}`, { headers });
        setFilmes(response.data);

        const generoResponse = await axios.get(`/api/genero`, { headers });
        console.log("📦 Dados recebidos de /api/genero:", generoResponse.data);

        const generosData = Array.isArray(generoResponse.data)
          ? generoResponse.data
          : generoResponse.data.generos || [];

        const generoEncontrado = generosData.find(
          (g: Genero) => g.id === parseInt(id || "")
        );
        setGenero(generoEncontrado);

        if (userId) {
          const favRes = await axios.get(`/api/favoritos/${userId}`, {
            headers,
          });
          const idsFavoritos = (favRes.data as FavoritoResponse[])
            .map((f) => f.favorito?.filmeId)
            .filter((id): id is number => id !== undefined);
          setFavoritos(idsFavoritos);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);

  const handleFilmeClick = (filmeId: number) => {
    navigate(`/filme/${filmeId}`);
  };

  const alternarFavorito = async (filmeId: number) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Usuário não autenticado");
      return;
    }

    const jaFavorito = favoritos.includes(filmeId);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (jaFavorito) {
        await axios.post(
          "/api/favoritos/remover",
          { userId, filmeId },
          { headers }
        );
        setFavoritos((prev) => prev.filter((id) => id !== filmeId));
      } else {
        await axios.post(
          "/api/favoritos/adicionar",
          { userId, filmeId },
          { headers }
        );
        setFavoritos((prev) => [...prev, filmeId]);
      }
    } catch (error) {
      console.error("❌ Erro ao favoritar/desfavoritar:", error);
    }
  };

  return (
    <Box p={4}>
      {loading ? (
        <Box className="genero-loading">
          <CircularProgress />
        </Box>
      ) : (
        <Box maxWidth="1400px" mx="auto">
          <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
            {genero ? `${genero.name}` : "Gênero não encontrado"}
          </Typography>

          <div className="genero-filmes-flex-container">
            {filmes.length > 0 ? (
              filmes.map((filme) => (
                <div className="genero-filmes-flex-item" key={filme.id}>
                  <Card className="genero-filmes-card">
                    <Box className="poster-wrapper">
                      <CardMedia
                        component="img"
                        className="genero-filmes-image"
                        image={filme.image || "https://via.placeholder.com/300"}
                        alt={filme.name}
                        onClick={() => handleFilmeClick(filme.id)}
                      />
                      <IconButton
                        className="heart-icon"
                        onClick={() => alternarFavorito(filme.id)}
                      >
                        {favoritos.includes(filme.id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Box>

                    <Box className="genero-filmes-details">
                      <Typography className="genero-filmes-name">
                        {filme.name}
                      </Typography>
                      <Typography className="genero-filmes-info">
                        <strong>Ano de lançamento:</strong> {filme.releaseYear}
                      </Typography>
                      <Typography className="genero-filmes-info">
                        <strong>Duração:</strong> {filme.duration} min
                      </Typography>
                    </Box>
                  </Card>
                </div>
              ))
            ) : (
              <Typography variant="h6" color="textSecondary">
                Nenhum filme encontrado para este gênero.
              </Typography>
            )}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default GeneroFilmes;
