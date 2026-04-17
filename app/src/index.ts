import Fastify from "fastify";
import routes from "./routs/index.js";
const fastify = Fastify({
  logger: true,
});
const PORT = parseInt(process.env.VITE_API_PORT ?? "3100", 10);
fastify.get("/", async (request, reply) => {
  return { message: "Ok" };
});
fastify.register(routes);
try {
  await fastify.listen({ port: PORT });
  fastify.log.info(`API ready at: ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
