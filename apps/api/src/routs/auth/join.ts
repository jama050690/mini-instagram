import type { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { users, db } from "./db.js"; // db qo'shildi
import ms from "ms";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "super-secret-access";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "super-secret-refresh";
const REFRESH_DURATION = "7d"; 
const ACCESS_DURATION = "15m";

// index.ts aynan 'schema' nomini qidirmoqda
export const schema = {
  body: {
    type: "object",
    required: ["email", "username", "password"],
    properties: {
      email: { type: "string", format: "email" },
      username: { type: "string", minLength: 5, maxLength: 40 },
      password: { type: "string", minLength: 8 }
    }
  }
};

type JoinBody = {
  email: string;
  username: string;
  password: string;
};

// index.ts aynan 'route' nomini qidirmoqda
export async function route(
  req: FastifyRequest<{ Body: JoinBody }>,
  reply: FastifyReply,
) {
  let { email, username, password } = req.body;
  username = username.toLowerCase();
  email = email.toLowerCase();

  const usernamePattern = /^(?=.{5,40}$)[a-z]+(_[a-z]+)*(_[0-9]+|[0-9]*)$/;
  
  if (users.has(username)) {
    return reply.status(400).send({ code: "API_AUTH_USERNAME_EXISTS" });
  }
  if (!usernamePattern.test(username)) {
    return reply.status(400).send({ code: "API_AUTH_USERNAME_INVALID" });
  }

  const hash = await argon2.hash(password);
  users.set(username, { email, username, password: hash });

  const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_DURATION });
  const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_DURATION });

  db.refreshTokens.set(refreshToken, username);

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/refresh",
    maxAge: ms(REFRESH_DURATION),
    signed: true,
  });

  return { accessToken, code: "API_AUTH_OK" };
}

// 2. REFRESH TOKEN FUNKSIYASI
export async function refreshRoute(req: FastifyRequest, reply: FastifyReply) {
  const cookie = req.cookies.refreshToken;
  
  if (!cookie) return reply.code(401).send({ error: "No token provided" });

  const unsigned = req.unsignCookie(cookie);
  const token = unsigned.value;

  if (!unsigned.valid || !token || !db.refreshTokens.has(token)) {
    return reply.code(401).send({ error: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { username: string };
    const accessToken = jwt.sign({ username: decoded.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_DURATION });

    return { accessToken };
  } catch (err) {
    db.refreshTokens.delete(token); // Muddati o'tgan bo'lsa bazadan o'chirish
    return reply.code(401).send({ error: "Token expired or invalid" });
  }
}

// 3. AUTHENTICATE HOOK (Middleware)
export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    (req as any).user = decoded; 
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
};
