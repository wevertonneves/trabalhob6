import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Caminho absoluto para o .env na raiz do projeto
const envFile = process.env.NODE_ENV === "production" ? ".env.docker" : ".env";
const envPath = path.resolve(__dirname, "..", "..", "..", envFile);

// Carrega as variáveis do .env da raiz
dotenv.config({ path: envPath });

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false, // silencia logs SQL
  }
);

export default sequelize;
