import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import dotenv from "dotenv";

dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET não está definido no arquivo .env");
}

console.log(" JWT_SECRET carregado a partir do .env");


export const generateToken = (user: { id: number; email: string }) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "2h",
  });
};


export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("Requisição de login recebida:");
  console.log("Email:", email);
  console.log("Senha:", password);

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha requeridos" });
  }

  try {
    const user = await UserModel.findOne({ where: { email } });
    console.log(" Resultado da busca no banco:", user);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const isValidPassword = await user.validatePassword(password);
    console.log(" Validação da senha:", isValidPassword);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      message: "Login efetuado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro inesperado no login:", error);
    res.status(500).json({
      error: "Erro interno no servidor",
      details: error,
    });
  }
};
