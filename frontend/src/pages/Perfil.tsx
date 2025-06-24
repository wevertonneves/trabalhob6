import { Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isValidPassword } from "../validators/validations";

const Perfil = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    cpf?: string;
  } | null>(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    axios
      .get(`api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login");
      });
  }, [navigate]);

  const handleTrocarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!user?.email || !novaSenha || !token) return;

    if (!isValidPassword(novaSenha)) {
      setErroSenha(
        "A senha deve ter no mínimo 8 caracteres e conter letras e números."
      );
      setMensagem("");
      return;
    }

    try {
      await axios.post(
        "api/nova-senha",
        { email: user.email, password: novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Senha atualizada com sucesso!");
      setErroSenha("");
      setNovaSenha("");
    } catch {
      setMensagem("Erro ao atualizar senha. Tente novamente.");
      setErroSenha("");
    }
  };

  const handleDeletarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!user?.id || !token) return;

    const senha = window.prompt("Digite sua senha para confirmar:");
    if (!senha) {
      setMensagem("Operação cancelada.");
      return;
    }

    try {
      const res = await axios.post(
        "api/verificar-senha",
        { email: user.email, password: senha },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.valido) {
        setMensagem("Senha incorreta.");
        return;
      }

      const confirmacao = window.confirm(
        "Tem certeza que deseja excluir sua conta?"
      );
      if (!confirmacao) {
        setMensagem("Exclusão cancelada.");
        return;
      }

      await axios.delete(`api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      navigate("/login");
    } catch {
      setMensagem("Erro ao verificar senha.");
    }
  };

  const formatarCPF = (cpf: string) => {
    const visivel = cpf.slice(0, 3);
    return `${visivel}.***.***-**`;
  };

  return (
    <Box className="bg-perfil">
      <Box className="background-overlay" />
      <Box className="login-container">
        <Box className="login-box" sx={{ color: "white" }}>
          <Typography variant="h4" mb={2}>
            Perfil do Usuário
          </Typography>

          {user ? (
            <>
              <Typography variant="body1">
                Nome: <strong>{user.name}</strong>
              </Typography>
              <Typography variant="body1">
                Email: <strong>{user.email}</strong>
              </Typography>
              {user.cpf && (
                <Typography variant="body1">
                  CPF: <strong>{formatarCPF(user.cpf)}</strong>
                </Typography>
              )}

              <Box component="form" onSubmit={handleTrocarSenha} mt={3}>
                <TextField
                  label="Nova Senha"
                  type="password"
                  fullWidth
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  error={!!erroSenha}
                  helperText={erroSenha}
                  sx={{
                    mb: 2,
                    input: { color: "white" },
                    label: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                />
                <Button variant="contained" color="primary" type="submit">
                  Atualizar Senha
                </Button>
              </Box>

              <Button
                variant="outlined"
                color="error"
                onClick={handleDeletarUsuario}
                sx={{ mt: 3 }}
              >
                Deletar Conta
              </Button>

              {mensagem && (
                <Typography
                  mt={2}
                  sx={{
                    color: mensagem.toLowerCase().includes("sucesso")
                      ? "lightgreen"
                      : "red",
                  }}
                >
                  {mensagem}
                </Typography>
              )}
            </>
          ) : (
            <Typography>Carregando informações do usuário...</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Perfil;
