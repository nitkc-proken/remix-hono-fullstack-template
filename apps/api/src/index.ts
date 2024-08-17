import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { exampleRoute } from "./example";

const app = new Hono().basePath("/api");
const route = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.route("/example", exampleRoute);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export type ApiType = typeof route;
