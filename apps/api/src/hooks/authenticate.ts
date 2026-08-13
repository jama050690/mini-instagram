import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.VITE_JWT_ACCESS_SECRET ||
  process.env.ACCESS_TOKEN_SECRET ||
  "super-secret-access";

export async function authenticate(
	req: FastifyRequest,
	reply: FastifyReply,
) {
	const auth = req.headers.authorization;

	if (!auth?.startsWith("Bearer ")) {
		reply.code(401).send({ error: "Unauthorized" });
		return;
	}

	try {
		const token = auth.slice(7);
		const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
		(req as any).user = decoded;
	} catch {
		reply.code(401).send({ error: "Unauthorized" });
		return;
	}
}
export default authenticate;
