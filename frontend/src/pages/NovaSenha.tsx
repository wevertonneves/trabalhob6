import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const NovaSenha = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  useEffect(() => {
    const emailSalvo = localStorage.getItem("emailRecuperacao");
    if (emailSalvo) {
      setEmailRecuperacao(emailSalvo);
    } else {
      setMensagem("Email não encontrado. Tente recuperar a senha novamente.");
    }
    document.getElementById("senha")?.focus();
  }, []);

  const handleNovaSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRecuperacao || !password) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setMensagem("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      const response = await axios.post("/api/nova-senha", {
        email: emailRecuperacao,
        password,
      });

      setMensagem(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setMensagem(error.response?.data?.error || "Erro ao atualizar senha.");
    }
  };

  return (
    <div className="bg-nova-senha">
      <div className="login-container">
        <div className="form-container">
          <h2 className="titulo-redefinir">Redefinir Senha</h2>

          <form onSubmit={handleNovaSenha}>
            <label htmlFor="senha" className="label-senha">
              Nova senha:
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />

            <button type="submit" className="btn-enviar">
              Enviar nova senha
            </button>
          </form>

          {mensagem && <p className="mensagem">{mensagem}</p>}
        </div>
      </div>
    </div>
  );
};

export default NovaSenha;
