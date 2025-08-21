import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.query("INSERT INTO usuarios (email, senha) VALUES (?, ?)", [email, hash]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}
