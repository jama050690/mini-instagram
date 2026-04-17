export type AuthUser = {
  email: string;
  password: string;
};

export type StoredUser = {
  username: string;
  email: string;
  password: string;
};

export const users = new Map<string, AuthUser>();

export function getUserByUsername(username: string): StoredUser | undefined {
  const normalizedUsername = username.toLowerCase();
  const user = users.get(normalizedUsername);

  if (!user) {
    return undefined;
  }

  return {
    username: normalizedUsername,
    ...user,
  };
}

export function getUserByEmail(email: string): StoredUser | undefined {
  const normalizedEmail = email.toLowerCase();

  for (const [username, user] of users.entries()) {
    if (user.email === normalizedEmail) {
      return {
        username,
        ...user,
      };
    }
  }

  return undefined;
}

export function getUserByLogin(login: string): StoredUser | undefined {
  const normalizedLogin = login.toLowerCase();

  return (
    getUserByUsername(normalizedLogin) ?? getUserByEmail(normalizedLogin)
  );
}
