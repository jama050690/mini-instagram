import type { FastifyInstance } from "fastify";
import { refreshTokens } from "./db.js";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/logout", async (req, reply) => {
    const rawCookie = req.cookies.refreshToken;

    if (rawCookie) {
      const unsigned = req.unsignCookie(rawCookie);

      if (unsigned.valid && unsigned.value) {
        refreshTokens.delete(unsigned.value);
      }
    }

    reply.clearCookie("refreshToken", { path: "/refresh" });
    return { code: "API_AUTH_LOGOUT_OK" };
  });
}
