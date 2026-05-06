import path from "path"
import { defineConfig, loadEnv } from "vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"

export default defineConfig( ( { mode } ) => {

	const env = loadEnv( mode, path.resolve( __dirname, "../../" ), "" )
	const port = parseInt( env.VITE_DASHBOARD_PORT )

	return {
		server: {
			host: true,
			port: port,
		},
		plugins: [
			react(),
			babel( { presets: [ reactCompilerPreset() ] } ),
		],
	}
} )
