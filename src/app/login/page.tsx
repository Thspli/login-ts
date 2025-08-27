"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/pessoas");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, margin: "auto", mt: 10 }}>
      <Typography variant="h5">Login</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} fullWidth />
      <Button variant="contained" color="primary" onClick={handleLogin}>Entrar</Button>

      {/* 👉 aqui que entra o botão de cadastro */}
      <Button variant="outlined" color="secondary" onClick={() => router.push("/cadastro")}>
        Criar conta
      </Button>
    </Box>
  );
}
