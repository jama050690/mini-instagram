import type { FastifyReply, FastifyRequest } from "fastify";
import { getUserByLogin } from "./db.js";

const bodyJSONSchema = {
  type: "object",
  required: ["usernameOrEmail", "password"],
  additionalProperties: false,
  properties: {
    usernameOrEmail: {
      type: "string",
      description:
        "Bu maydonga username yoki email yuboriladi. Ikkalasi ham ishlaydi.",
    },
    password: {
      type: "string",
      description:
        "join.ts dagi kabi: 8-64 belgi, kamida 1 kichik harf, 1 katta harf, 1 raqam va 1 maxsus belgi bo'lishi kerak.",
    },
  },
};

export const schema = {
  body: bodyJSONSchema,
};

type LoginBody = {
  usernameOrEmail: string;
  password: string;
};

export function route(
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply,
) {
  let { usernameOrEmail, password } = req.body;

  usernameOrEmail = usernameOrEmail.trim().toLowerCase();

  const usernamePattern = /^(?=.{5,40}$)[a-z]+(_[a-z]+)*(_[0-9]+|[0-9]*)$/;
  const emailPattern =
    /^(?=.{1,254}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;
  // Password: 8-64 belgi, katta-kichik harf, raqam va maxsus belgi majburiy.
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,64}$/;

  const isUsername = usernamePattern.test(usernameOrEmail);
  const isEmail = emailPattern.test(usernameOrEmail);

  if (!isUsername && !isEmail) {
    return res.status(400).send({ code: "API_AUTH_LOGIN_INVALID" });
  }

  if (!passwordPattern.test(password)) {
    return res.status(400).send({ code: "API_AUTH_PASSWORD_INVALID" });
  }

  const user = getUserByLogin(usernameOrEmail);

  if (!user || user.password !== password) {
    return res.status(401).send({ code: "API_AUTH_CREDENTIALS_INVALID" });
  }

  return {
    code: "API_AUTH_OK",
    user: {
      username: user.username,
      email: user.email,
    },
  };
}
