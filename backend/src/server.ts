import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import FilmesRoutes from "./routes/FilmesRoutes";
import GeneroRoutes from "./routes/GeneroRoutes";
import loginRoutes from "./routes/loginRoutes";
import favoritoRoutes from "./routes/favoritoRoutes";
import recuperarSenhaRoutes from "./routes/recuperarSenhaRoutes";
import { setupAssociations } from "./models/associations";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

console.log("🚀 Servidor iniciando...");
setupAssociations();

app.get("/", (_, res) => {
  console.log("API online!");
  res.send("API rodando corretamente!");
});

app.use(userRoutes);
app.use(FilmesRoutes);
app.use(GeneroRoutes);
app.use(loginRoutes);
app.use(favoritoRoutes);
app.use("/", recuperarSenhaRoutes);

export default app;
