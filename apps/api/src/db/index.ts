import pg from "pg";

function getPgConfig() {
  const rawHost = process.env.VITE_PG_HOST?.trim();
  const rawPort = Number(process.env.VITE_PG_PORT);
  const isDockerRuntime = process.env.DOCKER_ENV === "true";

  // Support the repo's older env values while keeping local `pnpm run dev`
  // pointed at the host-mapped Postgres port.
  if (!rawHost || rawHost === "mini_instagram_db") {
    return {
      host: isDockerRuntime ? "pg" : "localhost",
      port: isDockerRuntime ? 5432 : 5435,
    };
  }

  return {
    host: rawHost,
    port: Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 5435,
  };
}

const { host, port } = getPgConfig();

const pool = new pg.Pool({
  host,
  port,
  user: process.env.VITE_PG_USER || "postgres",
  password: process.env.VITE_PG_PASSWORD || "jama_9133",
  database: process.env.VITE_PG_DBNAME || "mini_instagram",
});

pool.on("error", (err: Error) => {
  console.error("Postgres pool error:", err);
});

export async function query<T>(text: string, ...params: unknown[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows;
}
