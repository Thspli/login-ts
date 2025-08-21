"use client";

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token); // salva token no localStorage
        alert("Login bem-sucedido!");
        router.push("/pessoas"); // redireciona para a página de pessoas
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Erro ao fazer login");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
        width: 300,
        margin: "0 auto",
      }}
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
        Entrar
      </Button>
    </Box>
  );
}
