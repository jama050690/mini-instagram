import type { FastifyReply, FastifyRequest } from "fastify";
import { users } from "./db.js";

const bodyJSONSchema = {
  type: "object",
  required: ["email", "username", "password"],
  additionalProperties: false,
  properties: {
    email: {
      type: "string",
      description: "Foydalanuvchi email manzili.",
    },
    username: {
      type: "string",
      description: "5-40 belgi oralig'idagi username.",
    },
    password: {
      type: "string",
      description:
        "8-64 belgi, kamida 1 kichik harf, 1 katta harf, 1 raqam va 1 maxsus belgi bo'lishi kerak.",
    },
  },
};

export const schema = {
  body: bodyJSONSchema,
};

type JoinBody = {
  email: string;
  username: string;
  password: string;
};

export function route(
  req: FastifyRequest<{ Body: JoinBody }>,
  res: FastifyReply,
) {
  let { email, username, password } = req.body;

  username = username.toLowerCase();
  email = email.toLowerCase();

  const usernamePattern = /^(?=.{5,40}$)[a-z]+(_[a-z]+)*(_[0-9]+|[0-9]*)$/;
  const emailPattern =
    /^(?=.{1,254}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;
  // Password: 8-64 belgi, katta-kichik harf, raqam va maxsus belgi majburiy.
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,64}$/;

  if (users.has(username)) {
    return res.status(400).send({ code: "API_AUTH_USERNAME_EXISTS" });
  } else if (!usernamePattern.test(username)) {
    return res.status(400).send({ code: "API_AUTH_USERNAME_INVALID" });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).send({ code: "API_AUTH_EMAIL_INVALID" });
  }

  if (!passwordPattern.test(password)) {
    return res.status(400).send({ code: "API_AUTH_PASSWORD_INVALID" });
  }

  //

  users.set(username, {
    email,
    password,
  });

  return {
    code: "API_AUTH_OK",
  };
}
