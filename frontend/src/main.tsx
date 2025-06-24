import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import GeneroFilmes from "./pages/GeneroFilmes";
import AdminPanel from "./pages/AdminPanel";
import EsqueciSenha from "./pages/EsqueciSenha";
import NovaSenha from "./pages/NovaSenha";
import Layout from "./components/Layout";
import ReproducaoFilme from "./pages/ReproducaoFilme";
import PrivateRoute from "./components/PrivateRoute";
import Perfil from "./pages/Perfil";
import Favoritos from "./pages/Favoritos";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/nova-senha" element={<NovaSenha />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="genero/:id" element={<GeneroFilmes />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="filme/:id" element={<ReproducaoFilme />} />
          <Route path="filmes/:id" element={<ReproducaoFilme />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="favoritos" element={<Favoritos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
