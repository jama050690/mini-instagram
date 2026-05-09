import type { FastifyInstance } from "fastify";
import { route as followHandler, schema as followSchema } from "./follow.js"
import * as hooks from "../../hooks/index.js"

export default function( fastify: FastifyInstance ) {

	fastify.post( "/user/follow", {
		schema: followSchema,
		onRequest: hooks.authenticate,
	}, followHandler )
}
