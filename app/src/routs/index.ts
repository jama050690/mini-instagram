import auth from "./auth/index.ts";
export default function (fastify) {
  fastify.register(auth);
}
