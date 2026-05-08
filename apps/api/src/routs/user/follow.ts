import { query } from "../../db.ts"

const bodyJSONSchema = {
	type: "object",
	required: [
		"follower_id",
		"followee_id",
	],
	properties: {
		follower_id: {
			type: "string",
		},
		followee_id: {
			type: "string",
		},
	}
}

export const schema = {
	body: bodyJSONSchema,
}

export async function route( req, res ) {

	let { follower_id, followee_id } = req.body

	const SQL = `
		INSERT INTO relations ( follower_id, followee_id )
		SELECT $1::uuid, $2::uuid
		WHERE
			EXISTS ( SELECT 1 FROM users WHERE id = $1::uuid ) AND
			EXISTS ( SELECT 1 FROM users WHERE id = $2::uuid ) AND
			$1 <> $2
		ON CONFLICT ( follower_id, followee_id ) DO NOTHING
		RETURNING id
	`

	const rows = await query( SQL, follower_id, followee_id )

	if ( rows.length === 0 ) {

		return {
			code: "API_FOLLOW_BAD_REQUEST",
		}
	}

	return {
		code: "API_FOLLOW_OK",
	}
}
