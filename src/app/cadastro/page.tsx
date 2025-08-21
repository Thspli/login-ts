"use client";

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const router = useRouter();

  const handleCadastro = async () => {
    if (senha !== confirmSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Cadastro realizado com sucesso!");
        router.push("/login"); // redireciona para login
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar usuário");
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
      <TextField
        label="Confirmar Senha"
        type="password"
        value={confirmSenha}
        onChange={(e) => setConfirmSenha(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleCadastro}>
        Cadastrar
      </Button>
    </Box>
  );
}
