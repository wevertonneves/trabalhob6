import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.warn("⚠️ Usuário não autenticado ou token ausente.");
      setLoading(false);
      return;
    }

    const buscarFavoritos = async () => {
      try {
        const response = await axios.get(`api/favoritos/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("⭐ Favoritos carregados:", response.data);
        setFavoritos(response.data);
      } catch (err) {
        console.error("❌ Erro ao buscar favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarFavoritos();
  }, []);

  return (
    <Box className="favoritos-container bg-perfil">
      <Typography variant="h4" gutterBottom className="favoritos-titulo">
        Meus Favoritos
      </Typography>

      {loading ? (
        <Typography className="favoritos-loading">Carregando...</Typography>
      ) : favoritos.length === 0 ? (
        <Typography className="favoritos-vazio">
          Nenhum favorito encontrado.
        </Typography>
      ) : (
        <div className="favoritos-flex-container">
          {favoritos.map((fav) => (
            <div className="favoritos-flex-item" key={fav.id}>
              <Link to={`/filme/${fav.id}`} className="favoritos-link">
                <Card className="favoritos-card">
                  {fav.image && (
                    <CardMedia
                      component="img"
                      image={fav.image}
                      alt={fav.name}
                      className="favoritos-img"
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {fav.name}
                    </Typography>
                    <Typography variant="body2" className="favoritos-info">
                      {fav.releaseYear} • {fav.duration} min
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default Favoritos;
