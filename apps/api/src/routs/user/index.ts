import { route as followHandler, schema as followSchema } from "./follow.ts"
import * as hooks from "../../hooks/index.ts"

export default function( fastify ) {

	fastify.post( "/user/follow", {
		schema: followSchema,
		onRequest: hooks.authenticate,
	}, followHandler )
}
