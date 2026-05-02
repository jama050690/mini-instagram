import type { FastifyInstance } from "fastify";
import auth from "./auth/index.ts";

export default function routes(fastify: FastifyInstance) {
  fastify.register(auth);
}
