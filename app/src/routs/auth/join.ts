import { users } from "./db.ts";

const bodyJSONSchema = {
  type: "object",
  required: ["email", "username", "password"],
  properties: {
    email: {
      type: "string",
    },
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
};

export const schema = {
  body: bodyJSONSchema,
};

export function route(req, res) {
  let { email, username, password } = req.body;

  username = username.toLowerCase();
  email = email.toLowerCase();

  const usernamePattern = /^(?=.{5,40}$)[a-z]+(_[a-z]+)*(_[0-9]+|[0-9]*)$/;
  const emailPattern =
    /^(?=.{1,254}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;
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
