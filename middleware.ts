// middleware.ts na raiz do projeto
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "meu_segredo"; // use .env em produção

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Protege frontend (/pessoas)
  if (url.pathname.startsWith("/pessoas")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Protege API (/api/pessoas)
  if (url.pathname.startsWith("/api/pessoas")) {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Sem token" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pessoas/:path*", "/api/pessoas/:path*"],
};
