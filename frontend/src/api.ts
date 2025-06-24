import axios from "axios";

const api = axios.create({
  baseURL: "/api", // porque backend está atrás de /api no nginx
});

export default api;
