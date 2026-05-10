import type { FastifyInstance } from "fastify";
import auth from "./auth/index.js";
import user from "./user/index.js";

export default function routes(fastify: FastifyInstance) {
  fastify.register(auth);
  fastify.register(user);
}
