"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <- importa o router
import {
  Button, TextField, Modal, Box,
  IconButton, Card, CardContent, Typography, Stack
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  telefone: string;
}

export default function PessoasPage() {
  const router = useRouter(); // <- inicializa o router

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [open, setOpen] = useState(false);
  const [editPessoa, setEditPessoa] = useState<Pessoa | null>(null);

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [telefone, setTelefone] = useState("");

  // Pega o token JWT do localStorage
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.replace("/login"); // <- redireciona se não tiver token
    } else {
      setToken(t);
    }
  }, [router]);

  const fetchPessoas = async () => {
    if (!token) return;
    const res = await fetch("/api/pessoas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPessoas(data);
  };

  useEffect(() => {
    if (token) fetchPessoas();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;

    const method = editPessoa ? "PUT" : "POST";
    const body = editPessoa
      ? { id: editPessoa.id, nome, idade: Number(idade), telefone }
      : { nome, idade: Number(idade), telefone };

    const res = await fetch("/api/pessoas", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.error) alert(data.error);

    setOpen(false);
    setNome("");
    setIdade("");
    setTelefone("");
    setEditPessoa(null);
    fetchPessoas();
  };

  const handleEdit = (p: Pessoa) => {
    setEditPessoa(p);
    setNome(p.nome);
    setIdade(p.idade.toString());
    setTelefone(p.telefone);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;

    const res = await fetch(`/api/pessoas?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.error) alert(data.error);

    fetchPessoas();
  };

  return (
    <Box sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 3 }}>
        {editPessoa ? "Editar Pessoa" : "Adicionar Pessoa"}
      </Button>

      <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
        {pessoas.map((p) => (
          <Card key={p.id} variant="outlined">
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>{p.nome} - {p.idade} anos - {p.telefone}</Typography>
              <Box>
                <IconButton color="primary" onClick={() => handleEdit(p)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(p.id)}><Delete /></IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          bgcolor: "background.paper", p: 4, borderRadius: 2, width: 300
        }}>
          <TextField fullWidth label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} sx={{ mb: 3 }} />
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
            {editPessoa ? "Salvar Alterações" : "Adicionar"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
