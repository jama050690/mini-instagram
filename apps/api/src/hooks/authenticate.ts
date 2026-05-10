import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "super-secret-access";

export function authenticate(
	req: FastifyRequest,
	reply: FastifyReply,
	done: () => void,
) {
	const auth = req.headers.authorization;

	if (!auth?.startsWith("Bearer ")) {
		return reply.code(401).send({ error: "Unauthorized" });
	}

	try {
		const token = auth.slice(7);
		const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
		(req as any).user = decoded;
		done();
	} catch {
		reply.code(401).send({ error: "Unauthorized" });
	}
}
