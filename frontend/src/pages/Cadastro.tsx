import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import "../styles/styles.css";

type FormFields = "nome" | "email" | "password" | "confirmPassword" | "cpf";

type FormData = {
  [key in FormFields]: string;
};

type FormErrors = {
  [key in FormFields]: string;
};

const Cadastro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
  });

  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    document.body.classList.add("bg-cadastro");
    return () => {
      document.body.classList.remove("bg-cadastro");
    };
  }, []);

  const handleInputChange = (field: FormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const setError = (field: FormFields, message: string) => {
    setFormErrors((prev) => ({ ...prev, [field]: message }));
  };

  const isValidCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, "");
    if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false;

    const calcCheckDigit = (base: string, factor: number) =>
      base
        .split("")
        .reduce((sum, num, index) => sum + parseInt(num) * (factor - index), 0);

    const base = cleanCPF.substring(0, 9);
    const digit1 = ((calcCheckDigit(base, 10) * 10) % 11) % 10;
    const digit2 = ((calcCheckDigit(base + digit1, 11) * 10) % 11) % 10;

    return cleanCPF.endsWith(`${digit1}${digit2}`);
  };

  const formatCpf = (value: string) => {
    const cpfNumbers = value.replace(/\D/g, "").slice(0, 11);
    return cpfNumbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  };

  const validateFields = (): boolean => {
    let isValid = true;

    const { nome, email, password, confirmPassword, cpf } = formData;

    if (!nome.trim()) {
      setError("nome", "⚠ O campo 'Nome' é obrigatório!");
      isValid = false;
    } else if (nome.trim().length < 3) {
      setError("nome", "⚠ Mínimo 3 caracteres!");
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.trim()) {
      setError("email", "⚠ O campo 'Email' é obrigatório!");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setError("email", "⚠ Insira um email válido!");
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{9,}$/;
    if (!password.trim()) {
      setError("password", "⚠ O campo 'Senha' é obrigatório!");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setError("password", "⚠ Mínimo 9 caracteres com letras e números!");
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      setError("confirmPassword", "⚠ Confirme sua senha!");
      isValid = false;
    } else if (password !== confirmPassword) {
      setError("confirmPassword", "⚠ As senhas não coincidem!");
      isValid = false;
    }

    if (!cpf.trim()) {
      setError("cpf", "⚠ O campo 'CPF' é obrigatório!");
      isValid = false;
    } else if (!isValidCPF(cpf)) {
      setError("cpf", "⚠ CPF inválido!");
      isValid = false;
    }

    return isValid;
  };

  const handleCadastro = async () => {
    if (!validateFields()) return;

    const { nome, email, password, cpf } = formData;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
          email,
          password,
          cpf: cpf.replace(/[^\d]/g, ""),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.id) {
          localStorage.setItem("userId", data.id);
        }

        setSuccessMessage(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const msg = data.error?.toLowerCase() || "";

        if (msg.includes("email")) {
          setError("email", `⚠ ${data.error}`);
        }

        if (msg.includes("cpf")) {
          setError("cpf", `⚠ ${data.error}`);
        }

        if (!msg.includes("cpf") && !msg.includes("email")) {
          alert(data.error || "Erro ao cadastrar.");
        }
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <Box className="login-box">
        <Typography
          variant="h3"
          className="logo netflix-font"
          align="center"
          gutterBottom
          sx={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          CADASTRO
        </Typography>

        {(
          [
            "nome",
            "email",
            "password",
            "confirmPassword",
            "cpf",
          ] as FormFields[]
        ).map((field) => (
          <TextField
            key={field}
            fullWidth
            variant="filled"
            label={
              formErrors[field] ||
              field.charAt(0).toUpperCase() + field.slice(1)
            }
            type={
              field.toLowerCase().includes("password") ? "password" : "text"
            }
            value={formData[field]}
            onChange={(e) =>
              handleInputChange(
                field,
                field === "cpf" ? formatCpf(e.target.value) : e.target.value
              )
            }
            placeholder={
              field === "email"
                ? "exemplo@dominio.com"
                : field === "cpf"
                ? "000.000.000-00"
                : ""
            }
            className="input-field"
            error={!!formErrors[field]}
            InputLabelProps={{
              style: formErrors[field]
                ? { color: "#d32f2f", fontWeight: "bold" }
                : {},
            }}
          />
        ))}

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleCadastro}
        >
          Cadastrar
        </Button>

        <Typography className="forgot-text">
          <a href="/login">Já tem uma conta? Faça login</a>
        </Typography>
      </Box>

      <Snackbar
        open={successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
          variant="filled"
        >
          Cadastro realizado com sucesso! Voltando para tela de login
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Cadastro;
