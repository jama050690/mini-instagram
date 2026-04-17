import type { FastifyInstance } from "fastify";
import auth from "./auth/index.js";

export default function routes(fastify: FastifyInstance) {
  fastify.register(auth);
}
