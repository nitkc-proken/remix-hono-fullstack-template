import * as esbuild from "esbuild";
esbuild.buildSync({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: "node",
	target: "node20.12",
	// 必要に応じてexternalを指定
	/* external: ["sharp", "@prisma/client", "@node-rs/argon2"], */
	outfile: "./dist/server.cjs",
});
