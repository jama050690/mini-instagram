import type { FastifyReply, FastifyRequest } from "fastify";

export function authenticate(
	req: FastifyRequest,
	reply: FastifyReply,
	done: () => void,
) {

	// const auth = req.headers.authorization

	// if ( !auth?.startsWith( "Bearer " ) ) {

	// 	return reply.code( 401 ).send( { error: "Unauthorized" } )
	// }

	// try {

	// 	req.user = jwt.verify( auth.slice( 7 ), ACCESS_TOKEN_SECRET )
	// 	done()
	// }
	// catch {

	// 	reply.code( 401 ).send( { error: "Unauthorized" } )
	// }

	console.log( "authenticate hook was fired" )

	done()
}
