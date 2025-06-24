// adminTypes.ts
export interface Movie {
  id?: string;
  name: string;
  year: string;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  genre: string;
  sinopse: string;
}

export interface Genero {
  id?: string;
  name: string;
  image: string;
}

export const initialMovie: Movie = {
  name: "",
  year: "",
  duration: "",
  imageUrl: "",
  videoUrl: "",
  genre: "",
  sinopse: "",
};

export const initialGenero: Genero = {
  name: "",
  image: "",
};

export const generoFields = [
  { name: "name", label: "Digite o nome do gênero" },
  { name: "image", label: "Link da imagem" },
];

export const movieFields = [
  { name: "name", label: "Name" },
  { name: "year", label: "Year" },
  { name: "duration", label: "Duration" },
  { name: "imageUrl", label: "Image URL" },
  { name: "videoUrl", label: "Video URL" },
  { name: "sinopse", label: "Sinopse" },
];

export const textFieldStyle = {
  input: { color: "#fff" },
  "& .MuiInputBase-input::placeholder": { color: "#ccc" },
  "& .MuiInputLabel-root": { color: "#ccc" },
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
};
