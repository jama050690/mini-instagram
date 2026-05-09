import { query } from "../../db/index.ts";
export const refreshTokens = new Map<string, string>();

type UserRow = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstname: string | null;
  lastname: string | null;
  birthday: string | null;
};

export async function getUserByUsername(username: string) {
  const rows = await query<UserRow>(
    "SELECT * FROM users WHERE username = $1 LIMIT 1",
    username.toLowerCase(),
  );
  return rows[0] ?? null;
}

export async function getUserByEmail(email: string) {
  const rows = await query<UserRow>(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    email.toLowerCase(),
  );
  return rows[0] ?? null;
}

export async function getUserByLogin(usernameOrEmail: string) {
  const value = usernameOrEmail.toLowerCase();
  const rows = await query<UserRow>(
    "SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1",
    value,
  );
  return rows[0] ?? null;
}

export { query };