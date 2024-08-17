import type { Env } from "~/@types/env";

// Server,Client共通で使う環境変数
export const PUBLIC_ENV =
	typeof document === "undefined"
		? typeof process === "undefined"
			? (import.meta.env as unknown as Env)
			: (process.env as unknown as Env)
		: window.ENV;
