import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = "meu_segredo";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Sem token");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    const [rows] = await db.query("SELECT * FROM pessoas");
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Sem token");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    const { nome, idade, telefone } = await req.json();
    await db.query("INSERT INTO pessoas (nome, idade, telefone) VALUES (?, ?, ?)", [nome, idade, telefone]);

    return NextResponse.json({ message: "Pessoa adicionada!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Sem token");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    const { id, nome, idade, telefone } = await req.json();
    await db.query("UPDATE pessoas SET nome = ?, idade = ?, telefone = ? WHERE id = ?", [nome, idade, telefone, id]);

    return NextResponse.json({ message: "Pessoa atualizada!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Sem token");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) throw new Error("ID necessário");

    await db.query("DELETE FROM pessoas WHERE id = ?", [Number(id)]);
    return NextResponse.json({ message: "Pessoa removida!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
