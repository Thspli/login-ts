"use client";

import * as React from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function LoginPage() {
  const [open, setOpen] = React.useState(false);
  const [pessoas, setPessoas] = React.useState<any[]>([]);
  const [nome, setNome] = React.useState("");
  const [idade, setIdade] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  // 🚀 Carregar do localStorage quando a página abrir
  React.useEffect(() => {
    const stored = localStorage.getItem("pessoas");
    if (stored) {
      setPessoas(JSON.parse(stored));
    }
  }, []);

  // 🚀 Sempre que pessoas mudar, salvar no localStorage
  React.useEffect(() => {
    localStorage.setItem("pessoas", JSON.stringify(pessoas));
  }, [pessoas]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
    setNome("");
    setIdade("");
    setTelefone("");
  };

  const handleSalvar = () => {
    const novaPessoa = { nome, idade, telefone };

    if (editIndex !== null) {
      // Editando
      const novasPessoas = [...pessoas];
      novasPessoas[editIndex] = novaPessoa;
      setPessoas(novasPessoas);
    } else {
      // Adicionando
      setPessoas([...pessoas, novaPessoa]);
    }

    handleClose();
  };

  const handleEditar = (index: number) => {
    const pessoa = pessoas[index];
    setNome(pessoa.nome);
    setIdade(pessoa.idade);
    setTelefone(pessoa.telefone);
    setEditIndex(index);
    setOpen(true);
  };

  const handleRemover = (index: number) => {
    const novasPessoas = pessoas.filter((_, i) => i !== index);
    setPessoas(novasPessoas);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
      <Button variant="contained" onClick={handleOpen}>
        Adicionar Pessoas
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editIndex !== null ? "Editar Pessoa" : "Adicionar Pessoa"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <TextField
              label="Idade"
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
            />
            <TextField
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <Button variant="contained" onClick={handleSalvar}>
              Salvar
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Lista de pessoas cadastradas */}
      <Box mt={3} width="100%" maxWidth={400}>
        <Typography variant="h6">Pessoas</Typography>
        <List>
          {pessoas.map((pessoa, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton onClick={() => handleEditar(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleRemover(index)}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`${pessoa.nome} (${pessoa.idade} anos)`}
                secondary={`Tel: ${pessoa.telefone}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
