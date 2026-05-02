import type { FastifyInstance } from "fastify";
import { route as joinHandler, schema as joinSchema } from "./join.js";
import { route as loginHandler, schema as loginSchema } from "./login.js";
import logout from "./logout.js";

export default function authRoutes(fastify: FastifyInstance) {
  fastify.post("/join", { schema: joinSchema }, joinHandler);
  fastify.post("/login", { schema: loginSchema }, loginHandler);
  fastify.register(logout);
}
