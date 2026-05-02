import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import routs from "./routs/index.ts";

const fastify = Fastify({
  logger: true,
});
const PORT = parseInt(process.env.VITE_API_PORT ?? "3100", 10);

fastify.get("/", async () => ({ message: "Ok" }));

await fastify.register(cors, {
  origin: process.env.VITE_CORS_ORIGIN ?? true,
  credentials: true,
});

await fastify.register(cookie, {
  secret: process.env.VITE_COOKIE_SECRET ?? "cookie_secret",
});

fastify.register(routs);

try {
  await fastify.listen({ port: PORT });
  fastify.log.info(`API ready at: ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
