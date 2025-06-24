// AdminPanel.tsx
import {
  Typography,
  Button,
  Box,
  TextField,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  initialMovie,
  initialGenero,
  generoFields,
  movieFields,
  textFieldStyle,
  Movie,
  Genero,
} from "./adminTypes";
import {
  getAllFilmes,
  getAllGeneros,
  handleAddMovie,
  handleDeleteMovie,
  handleDeleteGenero,
  handleAddGenero,
  handleUpdateGenero,
  handleUpdateMovie,
} from "./adminValidations";

const AdminPanel = () => {
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [updateMovie, setUpdateMovie] = useState<Movie & { id: string }>({
    ...initialMovie,
    id: "",
  });
  const [filmes, setFilmes] = useState<any[]>([]);
  const [generos, setGeneros] = useState<any[]>([]);
  const [selectedFilmeId, setSelectedFilmeId] = useState("");
  const [selectedGeneroId, setSelectedGeneroId] = useState("");
  const [newGenero, setNewGenero] = useState<Genero>(initialGenero);
  const [updateGenero, setUpdateGenero] = useState<Genero & { id: string }>({
    ...initialGenero,
    id: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setFilmes(await getAllFilmes());
      setGeneros(await getAllGeneros());
    };
    loadData();
  }, []);

  useEffect(() => {
    document.body.classList.add("bg-admin");
    return () => document.body.classList.remove("bg-admin");
  }, []);

  const handleChange = (e: any, setter: any) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderTextFields = (
    fields: { name: string; label: string }[],
    values: any,
    setter: any
  ) =>
    fields.map(({ name, label }) => (
      <TextField
        key={name}
        label={label}
        name={name}
        placeholder={label}
        value={values[name]}
        onChange={(e) => handleChange(e, setter)}
        fullWidth
        variant="filled"
        sx={{ ...textFieldStyle, mb: 2 }}
      />
    ));

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        color="white"
        sx={{ fontFamily: '"Bebas Neue", sans-serif' }}
      >
        Painel Administrativo
      </Typography>
      <Box
        className="admin-form-container"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 4,
          mt: 4,
          mb: 4,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          boxShadow: 4,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Formulário 1: Adicionar Filme */}
        <form
          id="add-movie-form"
          className="admin-form"
          style={{ flex: 1, minWidth: 320 }}
        >
          <Typography variant="h6" gutterBottom color="white">
            Adicionar Filme
          </Typography>
          {renderTextFields(movieFields, movie, setMovie)}
          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#ccc" }}>Gênero</InputLabel>
            <Select
              name="genre"
              value={movie.genre}
              onChange={(e) => handleChange(e, setMovie)}
              sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {generos.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            id="add-movie-button"
            fullWidth
            variant="contained"
            onClick={() =>
              handleAddMovie(
                movie,
                () => setMovie(initialMovie),
                () => getAllFilmes().then(setFilmes)
              )
            }
          >
            Adicionar Filme
          </Button>
        </form>

        {/* Formulário 2: Adicionar Gênero */}
        <form
          id="add-genre-form"
          className="admin-form"
          style={{ flex: 1, minWidth: 320 }}
        >
          <Typography variant="h6" gutterBottom color="white">
            Adicionar Gênero
          </Typography>
          {renderTextFields(generoFields, newGenero, setNewGenero)}
          <Button
            id="add-genre-button"
            fullWidth
            variant="contained"
            onClick={() =>
              handleAddGenero(
                newGenero,
                () => setNewGenero(initialGenero),
                () => getAllGeneros().then(setGeneros)
              )
            }
          >
            Adicionar Gênero
          </Button>
        </form>

        {/* Formulário 3: Atualizar Filme */}
        <form
          id="update-movie-form"
          className="admin-form"
          style={{ flex: 1, minWidth: 320 }}
        >
          <Typography variant="h6" gutterBottom color="white">
            Atualizar Filme
          </Typography>
          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#ccc" }}>Filme</InputLabel>
            <Select
              id="select-movie-to-update"
              value={updateMovie.id}
              onChange={(e) => {
                const filme = filmes.find((f) => f.id === e.target.value);
                if (filme) {
                  setUpdateMovie({
                    id: filme.id,
                    name: filme.name,
                    year: filme.releaseYear,
                    duration: filme.duration,
                    imageUrl: filme.image,
                    videoUrl: filme.videoUrl,
                    sinopse: filme.sinopse,
                    genre: filme.generos?.[0]?.id || "",
                  });
                }
              }}
              sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {filmes.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {renderTextFields(movieFields, updateMovie, setUpdateMovie)}
          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#ccc" }}>Gênero</InputLabel>
            <Select
              name="genre"
              value={updateMovie.genre}
              onChange={(e) => handleChange(e, setUpdateMovie)}
              sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {generos.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            id="update-movie-button"
            fullWidth
            variant="contained"
            color="warning"
            onClick={() =>
              handleUpdateMovie(
                updateMovie,
                () => setUpdateMovie({ ...initialMovie, id: "" }),
                () => getAllFilmes().then(setFilmes)
              )
            }
            disabled={!updateMovie.id}
          >
            Atualizar Filme
          </Button>
        </form>

        {/* Formulário 4: Atualizar Gênero */}
        <form
          id="update-genre-form"
          className="admin-form"
          style={{ flex: 1, minWidth: 320 }}
        >
          <Typography variant="h6" gutterBottom color="white">
            Atualizar Gênero
          </Typography>
          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#ccc" }}>Selecione um Gênero</InputLabel>
            <Select
              id="select-genre-to-update"
              value={updateGenero.id}
              onChange={(e) => {
                const genero = generos.find((g) => g.id === e.target.value);
                if (genero) {
                  setUpdateGenero({
                    id: genero.id,
                    name: genero.name,
                    image: genero.image || "",
                  });
                }
              }}
              sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {generos.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {renderTextFields(generoFields, updateGenero, setUpdateGenero)}

          <Button
            id="update-genre-button"
            fullWidth
            variant="contained"
            color="warning"
            onClick={() =>
              handleUpdateGenero(
                updateGenero,
                () => setUpdateGenero({ ...initialGenero, id: "" }),
                () => getAllGeneros().then(setGeneros)
              )
            }
          >
            Atualizar Gênero
          </Button>
        </form>

        {/* Formulário 5: Deletar Filme */}
        <form
          id="delete-movie-form"
          className="admin-form"
          style={{ flex: 1, minWidth: 320 }}
        >
          <Typography variant="h6" gutterBottom color="white">
            Deletar Filme
          </Typography>
          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#ccc" }}>Filme</InputLabel>
            <Select
              id="select-movie-to-delete"
              value={selectedFilmeId}
              onChange={(e) => setSelectedFilmeId(e.target.value)}
              sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {filmes.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            id="delete-movie-button"
            fullWidth
            variant="contained"
            color="error"
            onClick={() =>
              handleDeleteMovie(
                selectedFilmeId,
                () => setSelectedFilmeId(""),
                () => getAllFilmes().then(setFilmes)
              )
            }
          >
            Deletar Filme
          </Button>
        </form>

        {/* Formulário 6: Deletar Gênero */}
        <form
          id="delete-genre-form"
          className="admin-form"
          style={{ flex: 1, minWidth: 320 }}
        >
          <Typography variant="h6" gutterBottom color="white">
            Deletar Gênero
          </Typography>
          <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#ccc" }}>Selecione um Gênero</InputLabel>
            <Select
              id="select-genre-to-delete"
              value={selectedGeneroId}
              onChange={(e) => setSelectedGeneroId(e.target.value)}
              sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {generos.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            id="delete-genre-button"
            fullWidth
            variant="contained"
            color="error"
            onClick={() =>
              handleDeleteGenero(
                selectedGeneroId,
                () => setSelectedGeneroId(""),
                () => getAllGeneros().then(setGeneros)
              )
            }
          >
            Deletar Gênero
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AdminPanel;
