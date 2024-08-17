import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
} from "@remix-run/react";
import "./globals.css";
import type { Env } from "./@types/env";
import { PUBLIC_ENV } from "./lib/utils/env";

export async function loader() {
	return json({
		// ブラウザに公開する環境変数を入れる
		ENV:
			typeof document === "undefined"
				? ({
						HOST: PUBLIC_ENV.HOST as string,
						USE_MOCK: PUBLIC_ENV.USE_MOCK,
					} satisfies Env)
				: {},
	});
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useLoaderData<typeof loader>();
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				{
					<script
						// 公開する環境変数をwindows.ENVにセット
						// biome-ignore lint/security/noDangerouslySetInnerHtml: https://remix.run/docs/en/main/guides/envvars#browser-environment-variables
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
						}}
					/>
				}
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
// https://remix.run/docs/en/main/route/should-revalidate#never-reloading-the-root
export const shouldRevalidate = () => false;
