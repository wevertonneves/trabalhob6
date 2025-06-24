import { Router } from "express";
import {
  adicionarFavorito,
  removerFavorito,
  listarFavoritos,
} from "../controllers/FavoritoController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/favoritos/adicionar", authMiddleware, adicionarFavorito);
router.post("/favoritos/remover", authMiddleware, removerFavorito);     
router.get("/favoritos/:userId", authMiddleware, listarFavoritos);  

export default router;
