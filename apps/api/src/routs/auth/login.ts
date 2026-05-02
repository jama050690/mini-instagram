import type { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { getUserByLogin, db } from "./db.js"; // db.ts dan kerakli funksiyalarni import qilish
import ms from "ms";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "super-secret-access";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "super-secret-refresh";
const REFRESH_DURATION = "7d";
const ACCESS_DURATION = "15m";

// index.ts aynan 'schema' nomini qidirmoqda
export const schema = {
  body: {
    type: "object",
    required: ["usernameOrEmail", "password"],
    properties: {
      usernameOrEmail: { type: "string" },
      password: { type: "string" }
    }
  }
};

// index.ts aynan 'route' nomini qidirmoqda
export async function route(req: FastifyRequest<{ Body: any }>, res: FastifyReply) {
  const { usernameOrEmail, password } = req.body;

  const user = getUserByLogin(usernameOrEmail);
  if (!user) {
    return res.status(401).send({ code: "API_AUTH_USER_NOT_FOUND" });
  }

  const isValidPassword = await argon2.verify(user.password, password);
  if (!isValidPassword) {
    return res.status(401).send({ code: "API_AUTH_PASSWORD_WRONG" });
  }

  const accessToken = jwt.sign({ username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_DURATION });
  const refreshToken = jwt.sign({ username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_DURATION });

  db.refreshTokens.set(refreshToken, user.username);

  res.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/refresh",
    maxAge: ms(REFRESH_DURATION),
    signed: true,
  });

  return {
    code: "API_AUTH_OK",
    accessToken,
    user: {
      username: user.username,
      email: user.email,
    },
  };
}