import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import axios from "axios";
import "../styles/styles.css";

const TEMPO_EXPIRACAO = 600; // 10 minutos em segundos

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(TEMPO_EXPIRACAO);

  // Inicia timer de expiração do código
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  // Aplica fundo personalizado
  useEffect(() => {
    document.body.classList.add("bg-recuperar");
    return () => document.body.classList.remove("bg-recuperar");
  }, []);

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    const restoSegundos = (segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${restoSegundos}`;
  };

  const exibirMensagem = (msg: string) => setMessage(msg);

  const enviarCodigo = async () => {
    if (!email)
      return exibirMensagem("Informe seu email para recuperar a senha.");

    try {
      setLoading(true);
      await axios.post("/api/recuperar-senha", { email });
      exibirMensagem("Código enviado para seu email.");
      setStep(2);
      setCountdown(TEMPO_EXPIRACAO);
    } catch (err: any) {
      exibirMensagem(err.response?.data?.error || "Erro ao enviar código.");
    } finally {
      setLoading(false);
    }
  };

  const verificarCodigo = async () => {
    if (!code) return exibirMensagem("Digite o código recebido.");
    if (countdown <= 0)
      return exibirMensagem("O código expirou. Reenvie para tentar novamente.");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/validar-codigo", {
        email,
        codigoRecebido: code,
      });
      exibirMensagem(data.message);
      localStorage.setItem("emailRecuperacao", email);
      navigate("/nova-senha");
    } catch (err: any) {
      exibirMensagem(err.response?.data?.error || "Erro ao validar o código.");
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    try {
      setLoading(true);
      await axios.post("/api/recuperar-senha", { email });
      exibirMensagem("Novo código enviado.");
      setCountdown(TEMPO_EXPIRACAO);
    } catch (err: any) {
      exibirMensagem(err.response?.data?.error || "Erro ao reenviar código.");
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <TextField
        fullWidth
        variant="filled"
        label="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      {message && <Typography color="error">{message}</Typography>}
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={enviarCodigo}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Enviar Código"
        )}
      </Button>
    </>
  );

  const renderCodigoStep = () => (
    <>
      <TextField
        fullWidth
        variant="filled"
        label="Digite o código recebido"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="input-field"
      />
      <Typography sx={{ mt: 1, color: "white" }}>
        Tempo restante: {formatarTempo(countdown)}
      </Typography>
      {message && <Typography color="error">{message}</Typography>}
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={verificarCodigo}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Verificar Código"
        )}
      </Button>
      <Button
        variant="text"
        onClick={reenviarCodigo}
        sx={{ color: "white", mt: 1 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Reenviar código"
        )}
      </Button>
    </>
  );

  return (
    <div className="login-container">
      <Fade in timeout={600}>
        <Box className="login-box">
          <Typography
            variant="h4"
            className="logo"
            sx={{
              color: "white",
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: 1,
            }}
          >
            Recuperar Senha
          </Typography>

          {step === 1 ? renderEmailStep() : renderCodigoStep()}

          <Typography className="forgot-text" sx={{ mt: 3 }}>
            <a href="#" onClick={() => navigate("/login")}>
              Voltar para o Login
            </a>
          </Typography>
        </Box>
      </Fade>
    </div>
  );
};

export default RecuperarSenha;
