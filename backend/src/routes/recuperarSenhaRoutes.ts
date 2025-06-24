
import express from "express";
import {
  recuperarSenha,
  validarCodigo,
  redefinirSenha,
} from "../controllers/recuperarSenhaController";

const router = express.Router();

router.post("/recuperar-senha", recuperarSenha);
router.post("/validar-codigo", validarCodigo);
router.post("/nova-senha", redefinirSenha);

export default router;
