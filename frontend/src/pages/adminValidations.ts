// adminValidations.ts
import axios from "axios";
import { Movie, Genero } from "./adminTypes";

const API_BASE_URL = "api";

export const getToken = () => localStorage.getItem("token");

export const fetchData = async (endpoint: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    return [];
  }
};

export const sendData = async (
  method: string,
  endpoint: string,
  data?: any
) => {
  return axios({
    method,
    url: `${API_BASE_URL}/${endpoint}`,
    data,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const handleAddMovie = async (
  movie: Movie,
  resetForm: () => void,
  refreshData: () => void
) => {
  try {
    await sendData("post", "filmes", {
      ...movie,
      genres: [movie.genre],
    });
    alert("Filme adicionado com sucesso!");
    resetForm();
    refreshData();
  } catch (error) {
    console.error("Erro ao adicionar filme:", error);
  }
};

export const handleDeleteMovie = async (
  id: string,
  resetId: () => void,
  refreshData: () => void
) => {
  if (!id || !window.confirm("Deseja deletar este filme?")) return;
  try {
    await sendData("delete", `filmes/${id}`);
    alert("Filme deletado com sucesso!");
    resetId();
    refreshData();
  } catch (error) {
    console.error("Erro ao deletar filme:", error);
  }
};

export const handleDeleteGenero = async (
  id: string,
  resetId: () => void,
  refreshData: () => void
) => {
  if (!id || !window.confirm("Deseja deletar este gênero?")) return;
  try {
    await sendData("delete", `genero/${id}`);
    alert("Gênero deletado com sucesso!");
    resetId();
    refreshData();
  } catch (error) {
    console.error("Erro ao deletar gênero:", error);
  }
};

export const handleAddGenero = async (
  genero: Genero,
  resetForm: () => void,
  refreshData: () => void
) => {
  if (!genero.name.trim()) return;
  try {
    await sendData("post", "genero", genero);
    alert("Gênero adicionado com sucesso!");
    resetForm();
    refreshData();
  } catch (error) {
    console.error("Erro ao adicionar gênero:", error);
  }
};

export const handleUpdateGenero = async (
  genero: Genero & { id: string },
  resetForm: () => void,
  refreshData: () => void
) => {
  if (!genero.id || !genero.name.trim()) return;
  try {
    await sendData("put", `genero/${genero.id}`, genero);
    alert("Gênero atualizado com sucesso!");
    resetForm();
    refreshData();
  } catch (error) {
    console.error("Erro ao atualizar gênero:", error);
  }
};

export const handleUpdateMovie = async (
  movie: Movie & { id: string },
  resetForm: () => void,
  refreshData: () => void
) => {
  try {
    await sendData("put", `filmes/${movie.id}`, {
      ...movie,
      genres: [movie.genre],
    });
    alert("Filme atualizado com sucesso!");
    resetForm();
    refreshData();
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
  }
};

export const getAllFilmes = async () => await fetchData("filmes");
export const getAllGeneros = async () => await fetchData("genero");
