import type { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
// MUHIM: db importini to'g'rilaymiz
import { getUserByEmail, getUserByUsername, refreshTokens, query } from "../services/db.js";

import ms from "ms";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "super-secret-access";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "super-secret-refresh";
const REFRESH_DURATION = "7d"; 
const ACCESS_DURATION = "15m";

export const schema = {
  body: {
    type: "object",
    required: ["email", "username", "password"],
    properties: {
      email: { type: "string", format: "email" },
      username: { type: "string", minLength: 5, maxLength: 40 },
      password: { type: "string", minLength: 8 },
      firstname: { type: "string", maxLength: 32 },
      lastname: { type: "string", maxLength: 32 },
      birthday: { type: "string" }
    }
  }
};

type JoinBody = {
  email: string;
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
};

export async function route(
  req: FastifyRequest<{ Body: JoinBody }>,
  reply: FastifyReply,
) {
  let { email, username, password, firstname, lastname, birthday } = req.body;
  username = username.toLowerCase();
  email = email.toLowerCase();
  
  const usernamePattern = /^(?=.{5,40}$)[a-z]+(_[a-z]+)*(_[0-9]+|[0-9]*)$/;
  
  if (await getUserByUsername(username)) {
    return reply.status(400).send({ code: "API_AUTH_USERNAME_EXISTS" });
  }
  if (await getUserByEmail(email)) {
    return reply.status(400).send({ code: "API_AUTH_EMAIL_EXISTS" });
  }
  if (!usernamePattern.test(username)) {
    return reply.status(400).send({ code: "API_AUTH_USERNAME_INVALID" });
  }

  const hash = await argon2.hash(password);
  const normalizedBirthday = birthday
    ? /^\d{2}-\d{2}-\d{4}$/.test(birthday)
      ? birthday.split("-").reverse().join("-")
      : birthday
    : null;

  await query(
    `
      INSERT INTO users (username, email, password, firstname, lastname, birthday)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    username,
    email,
    hash,
    firstname ?? null,
    lastname ?? null,
    normalizedBirthday,
  );

  const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_DURATION });
  const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_DURATION });

  // TUZATILDI: db. olib tashlandi
  refreshTokens.set(refreshToken, username);

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

export async function refreshRoute(req: FastifyRequest, reply: FastifyReply) {
  const cookie = req.cookies.refreshToken;
  
  if (!cookie) return reply.code(401).send({ error: "No token provided" });

  const unsigned = req.unsignCookie(cookie);
  const token = unsigned.value;

  // TUZATILDI: db. olib tashlandi
  if (!unsigned.valid || !token || !refreshTokens.has(token)) {
    return reply.code(401).send({ error: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { username: string };
    const accessToken = jwt.sign({ username: decoded.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_DURATION });

    return { accessToken };
  } catch (err) {
    // TUZATILDI: db. olib tashlandi
    if (token) refreshTokens.delete(token); 
    return reply.code(401).send({ error: "Token expired or invalid" });
  }
}

