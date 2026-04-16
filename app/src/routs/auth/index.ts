import { route as joinHandler, schema as joinSchema } from "./join.ts";

export default function (fastify) {
  fastify.post("/join", { schema: joinSchema }, joinHandler);
}
