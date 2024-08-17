import { serve } from "@hono/node-server";
import { configDotenv } from "dotenv";
import { Hono } from "hono";
import { exampleRoute } from "./example";
configDotenv();

const app = new Hono().basePath("/api");
const route = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.route("/example", exampleRoute);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export type ApiType = typeof route;
