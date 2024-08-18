import path from "node:path";

import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import {
	type Plugin,
	type ResolvedConfig,
	defineConfig,
	loadEnv,
	normalizePath,
} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// Node.js polyfill
installGlobals();

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const isSPA = env.USE_SPA === "true";
	return {
		plugins: [
			isSPA ? forceSPA() : undefined,
			mdx({
				remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
			}),
			remix({
				future: {
					v3_fetcherPersist: true,
					v3_relativeSplatPath: true,
					v3_throwAbortReason: true,
				},
				ssr: !isSPA,
			}),
			tsconfigPaths(),
		],
		// Proxy for REST API
		server: {
			proxy: {
				"/api": {
					target: "http://localhost:3000",
					changeOrigin: true,
				},
			},
			port: Number(env.PORT) ?? 8080,
		},
	};
});

export function forceSPA(): Plugin {
	let config: ResolvedConfig;
	const remixAppDir = "./app";
	const absPath = normalizePath(path.resolve(remixAppDir));
	return {
		name: "auto-client",
		configResolved(resolvedConfig) {
			// 解決された設定を保存
			config = resolvedConfig;
		},
		transform: {
			order: "pre",
			handler(src, id, options) {
				//if (config.command !== 'build') return
				const shortPath = id.replace(absPath, "");
				if (shortPath === "/lib/utils/mock.ts") {
					// replace PUBLIC_ENV.USE_MOCK === "true" to window.ENV.USE_MOCK === "true"
					return {
						code: src.replace(/PUBLIC_ENV.USE_MOCK === "true"/g, "true"),
						map: null,
					};
				}

				if (!shortPath.startsWith("/routes/") && shortPath !== "/root.tsx")
					return;
				const modified =
					//replace loader to clientLoader
					src
						.replace(
							/export async function loader/g,
							"export async function clientLoader",
						)
						//replace action to clientAction
						.replace(
							/export async function action/g,
							"export async function clientAction",
						);
				// replace json({...}) to {...}
				//.replace(/return json\(([\s\S]*?)\);/g, 'return $1;');

				return {
					code: modified,
					map: null,
				};
			},
		},
	};
}
