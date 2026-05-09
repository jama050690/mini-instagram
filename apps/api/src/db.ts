import pg from "pg";

const pool = new pg.Pool({
  host: process.env.VITE_PG_HOST || "localhost",
  port: Number(process.env.VITE_PG_PORT) || 5435,
  user: process.env.VITE_PG_USER || "postgres",
  password: process.env.VITE_PG_PASSWORD || "jama_9133",
  database: process.env.VITE_PG_DBNAME || "mini_instagram",
});

export async function query<T>(text: string, ...params: unknown[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows;
}

