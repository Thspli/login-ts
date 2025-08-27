import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "meu_segredo"; // Em produção, coloque no .env

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();
    if (!email || !senha) throw new Error("Faltando campos");

    // Pega usuário do banco
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const usuarios = rows as any[];
    if (!usuarios.length) throw new Error("Usuário não encontrado");

    const user = usuarios[0];

    // Verifica senha
    const isValid = await bcrypt.compare(senha, user.senha);
    if (!isValid) throw new Error("Senha inválida");

    // Gera JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // token válido por 1 hora
    );

    // Cria resposta
    const res = NextResponse.json({ token });

    // Seta cookie com token
    res.cookies.set("token", token, {
      httpOnly: true, // Não acessível pelo JS no browser
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hora
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
