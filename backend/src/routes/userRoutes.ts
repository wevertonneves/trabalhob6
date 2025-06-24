import express from "express";
import {
  getAll,
  getUserByid,
  createUser,
  updateUser,
  updatePassword ,
  destroyUserByid,
  verificarSenha, 


} from "../controllers/userController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", authMiddleware, getAll);
router.get("/users/:id" , authMiddleware, getUserByid);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, destroyUserByid);
router.post("/nova-senha", updatePassword);
router.post("/verificar-senha", verificarSenha);




export default router;
