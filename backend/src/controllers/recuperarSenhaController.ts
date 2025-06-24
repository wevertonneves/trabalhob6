import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel";
import { isEmailValido, gerarCodigo, enviarEmail } from "../validators/Validators";
import { codigosRecuperacao } from "../memory/recuperacaoSenhaStore";

dotenv.config();

export const recuperarSenha = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Por favor, insira um email." });
  }

  if (!isEmailValido(email)) {
    return res.status(400).json({ error: "Email inválido. Verifique o formato." });
  }

  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Email não cadastrado!" });

    const codigo = gerarCodigo();
    const expira = Date.now() + 10 * 60 * 1000;

    codigosRecuperacao[email] = { codigo, expira };
    await enviarEmail(email, codigo);

    console.log(`Código enviado para ${email}: ${codigo}`);
    res.json({ message: "Código de recuperação enviado ao e-mail." });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
};

export const validarCodigo = (req: Request, res: Response) => {
  const { email, codigoRecebido } = req.body;
  const registro = codigosRecuperacao[email];

  if (!registro || Date.now() > registro.expira) {
    delete codigosRecuperacao[email];
    return res.status(400).json({ error: "Código expirado ou inválido!" });
  }

  if (registro.codigo !== codigoRecebido) {
    return res.status(400).json({ error: "Código inválido!" });
  }

  res.json({ message: "Código validado com sucesso!" });
};

export const redefinirSenha = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e nova senha são obrigatórios" });
  }

  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado!" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    delete codigosRecuperacao[email];
    res.json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
};
