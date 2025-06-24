import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box, CircularProgress } from "@mui/material";

interface Filme {
  id: number;
  name: string;
  sinopse: string;
}

const FilmeDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchFilme = async () => {
      try {
        const response = await axios.get(`api/filmes/${id}`);
        setFilme(response.data);
      } catch (err) {
        console.error("Erro ao buscar filme:", err);
        setErro("Filme não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilme();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (erro) return <Typography color="error">{erro}</Typography>;
  if (!filme) return null;

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "0 auto", color: "white" }}>
      <Typography variant="h3" gutterBottom>
        {filme.name}
      </Typography>
      <Typography variant="body1" fontSize={18}>
        {filme.sinopse}
      </Typography>
    </Box>
  );
};

export default FilmeDetalhes;
