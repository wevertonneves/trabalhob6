import express from "express";
import {
  getAll,
  getFilmesPorGenero,
  createGenero,
  updateGenero,
  deleteGenero,
} from "../controllers/GeneroController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();


router.get("/genero", authMiddleware, getAll);
router.get("/genero/:id", authMiddleware, getFilmesPorGenero);
router.post("/genero", authMiddleware, createGenero);
router.put("/genero/:id", authMiddleware, updateGenero);
router.delete("/genero/:id", authMiddleware, deleteGenero);

export default router;
