import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import "../styles/styles.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("bg-login");

    return () => {
      document.body.classList.remove("bg-login");
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.name);

      navigate("/home");
    } catch {
      setError("Credenciais inválidas!");
    }
  };

  return (
    <div className="login-container">
      <Box className="login-box">
        <img src="/logo.png" alt="Logo Gambyflix" className="logo-img" />

        <TextField
          fullWidth
          variant="filled"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <TextField
          fullWidth
          variant="filled"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleLogin}
        >
          ENTRAR
        </Button>

        <Typography className="register-text">
          NÃO É MEMBRO?{" "}
          <span className="link" onClick={() => navigate("/cadastro")}>
            FAÇA TESTE GRÁTIS POR UM MÊS
          </span>
        </Typography>
        <Typography className="forgot-text">
          <span className="link" onClick={() => navigate("/esqueci-senha")}>
            ESQUECI MINHA SENHA
          </span>
        </Typography>
      </Box>
    </div>
  );
};

export default Login;
