import { query } from "../../db/index.js";

export const refreshTokens = new Map<string, string>();

type UserRow = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstname: string | null;
  lastname: string | null;
  birthday: string | null;
  is_active?: boolean;
};

export async function getUserByUsername(username: string) {
  const rows = await query<UserRow>(
    "SELECT * FROM users WHERE username = $1 LIMIT 1",
    username.toLowerCase(),
  );
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  const rows = await query<UserRow>(
    "SELECT * FROM users WHERE id = $1::uuid LIMIT 1",
    id,
  );
  return rows[0] ?? null;
}

export async function activateUserById(id: string) {
  const rows = await query<UserRow>(
    `
      UPDATE users
      SET is_active = true
      WHERE id = $1::uuid
      RETURNING *
    `,
    id,
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
