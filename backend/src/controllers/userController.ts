import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { UniqueConstraintError } from "sequelize";
import { validateName, validateEmail, validatePassword, validateCpf } from "../validators/Validators";

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários.", message: error instanceof Error ? error.message : error });
  }
};

export const getUserByid = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário.", message: error instanceof Error ? error.message : error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    let { name, email, password, cpf } = req.body;

    name = name?.trim();
    email = email?.trim();
    password = password?.trim();
    cpf = cpf?.trim();

    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validateCpf(cpf);

    const user = await UserModel.create({ name, email, password, cpf });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0]?.path;
  
      if (field === "email") {
        return res.status(409).json({ error: "Este email já está cadastrado." });
      }
  
      if (field === "cpf") {
        return res.status(409).json({ error: "Este CPF já está cadastrado." });
      }
  
      return res.status(409).json({ error: "Campo duplicado." });
    }
  
    res.status(400).json({ error: error instanceof Error ? error.message : "Erro ao criar usuário." });
  }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { name, email, password, cpf } = req.body;

    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (name?.trim()) {
      validateName(name);
      user.name = name.trim();
    }
    if (email?.trim()) {
      validateEmail(email);
      user.email = email.trim();
    }
    if (password?.trim()) {
      validatePassword(password);
      user.password = password.trim();
    }
    if (cpf?.trim()) {
      validateCpf(cpf);
      user.cpf = cpf.trim();
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Erro ao atualizar usuário." });
  }
};

export const destroyUserByid = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário.", message: error instanceof Error ? error.message : error });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e nova senha são obrigatórios." });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    validatePassword(password);
    user.password = password.trim();
    await user.save();

    res.json({ success: true, message: "Senha alterada com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Erro ao atualizar senha." });
  }
};

export const verificarSenha = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const senhaValida = await user.validatePassword(password);
    if (!senhaValida) {
      return res.json({ valido: false });
    }

    return res.json({ valido: true });
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return res.status(500).json({ error: "Erro interno ao verificar senha." });
  }
};