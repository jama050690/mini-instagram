import type { FastifyInstance } from "fastify";
import { route as joinHandler, schema as joinSchema, refreshRoute } from "./join.js";
import { route as loginHandler, schema as loginSchema } from "./login.js";
import logout from "./logout.js";

export default function authRoutes(fastify: FastifyInstance) {
  fastify.post("/join", { schema: joinSchema }, joinHandler);
  fastify.post("/login", { schema: loginSchema }, loginHandler);
  fastify.post("/refresh", refreshRoute);
  fastify.register(logout);
}
