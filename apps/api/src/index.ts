import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import routs from "./routs/index.js";

const fastify = Fastify({
  logger: true,
});
const PORT = parseInt(process.env.VITE_API_PORT ?? "3101", 10);

fastify.get("/", async () => ({ message: "Ok" }));

const corsOrigins = (process.env.VITE_CORS_ORIGIN ?? "http://localhost:3200,http://localhost:5100")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

await fastify.register(cors, {
  origin: corsOrigins,
  credentials: true,
});

await fastify.register(cookie, {
  secret: process.env.VITE_COOKIE_SECRET ?? "cookie_secret",
});

fastify.register(routs);

try {
  await fastify.listen({ host: "0.0.0.0", port: PORT });
  fastify.log.info(`API ready at: ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
