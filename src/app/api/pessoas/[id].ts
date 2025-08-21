import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "meu_segredo_super_secreto";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Token ausente" }, { status: 401 });

    const token = auth.split(" ")[1];
    jwt.verify(token, SECRET);

    const { nome, idade, telefone } = await req.json();

    const conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "pessoas_db",
        port: 3307
    });

    await conn.execute("UPDATE pessoas SET nome = ?, idade = ?, telefone = ? WHERE id = ?", [
      nome,
      idade,
      telefone,
      params.id,
    ]);

    return NextResponse.json({ message: "Pessoa atualizada!" });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Token ausente" }, { status: 401 });

    const token = auth.split(" ")[1];
    jwt.verify(token, SECRET);

    const conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "pessoas_db",
        port: 3307
    });

    await conn.execute("DELETE FROM pessoas WHERE id = ?", [params.id]);

    return NextResponse.json({ message: "Pessoa removida!" });
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
