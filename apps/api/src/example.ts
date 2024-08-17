import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const example = new Hono();

const schema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
	created: z.date(),
});

type Data = z.infer<typeof schema>;

const db: Data[] = [];

export const exampleRoute = example
	.get("/tasks", (c) => {
		return c.json(db);
	})
	// With Validation
	.post("/tasks/new", zValidator("json", schema.pick({ title: true })), (c) => {
		const data = c.req.valid("json");
		const newTask = {
			id: Math.random().toString(36).slice(-8),
			title: data.title,
			completed: false,
			created: new Date(),
		};
		db.push(newTask);

		return c.json(
			newTask,
			201, // Created
		);
	})
	.post(
		"/tasks/:id",
		zValidator("json", schema.pick({ title: true, completed: true }).partial()),
		(c) => {
			const data = c.req.valid("json");
			const { id } = c.req.param();

			const index = db.findIndex((task) => task.id === id);
			if (index === -1) {
				return c.text("Task not found", 404);
			}

			db[index] = {
				...db[index],
				...data,
			};

			return c.json(db[index]);
		},
	)
	.delete("/tasks/:id", (c) => {
		const { id } = c.req.param();
		const index = db.findIndex((task) => task.id === id);
		if (index === -1) {
			return c.json(false, 404);
		}

		db.splice(index, 1);

		return c.json(true);
	});
