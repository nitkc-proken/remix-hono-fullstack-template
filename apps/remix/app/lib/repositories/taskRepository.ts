import { ulid } from "ulid";

import { rpc } from "~/lib/utils/hc";
import type { Task, TaskContents } from "../types/task";
import { mock, mockWithArray } from "../utils/mock";

type TaskRepository = {
	listTask(): Promise<Task[]>;
	addTask(title: string): Promise<Task>;
	updateTask(taskId: string, updatedTask: Partial<TaskContents>): Promise<Task>;
	removeTask(taskId: string): Promise<boolean>;
};

const TaskRepositoryImpl = {
	async listTask() {
		const res = await rpc.api.example.tasks.$get();
		const r = await res.json();
		return r.map((task) => ({
			id: task.id,
			title: task.title,
			completed: task.completed,
			created: new Date(task.created),
		}));
	},
	async addTask(title) {
		const res = await rpc.api.example.tasks.new.$post({ json: { title } });
		const task = await res.json();
		return {
			...task,
			created: new Date(task.created),
		} as Task;
	},
	async updateTask(taskId, updatedTask) {
		const res = await rpc.api.example.tasks[":id"].$post({
			param: { id: taskId },
			json: updatedTask,
		});
		const task = await res.json();
		return {
			...task,
			created: new Date(task.created),
		} as Task;
	},
	async removeTask(taskId) {
		const res = await rpc.api.example.tasks[":id"].$delete({
			param: { id: taskId },
		});
		return res.status === 200;
	},
} satisfies TaskRepository;

const TaskRepositoryMock = mockWithArray<Task, TaskRepository>(
	"task",
	(db) =>
		({
			async listTask() {
				return db;
			},
			async addTask(title) {
				const id = ulid();
				const task = {
					id,
					title,
					completed: false,
					created: new Date(),
				};
				db.push(task);
				return task;
			},
			async updateTask(taskId, updatedTask) {
				const taskIndex = db.findIndex((task) => task.id === taskId);
				if (taskIndex === -1) throw Error("task not found");
				const newTask = {
					...db[taskIndex],
					...updatedTask,
				};
				db[taskIndex] = newTask;
				return newTask;
			},
			async removeTask(taskId) {
				return (
					db.splice(
						db.findIndex((task) => task.id === taskId),
						1,
					).length > 0
				);
			},
		}) satisfies TaskRepository,
	[
		{
			id: "1",
			title: "task1",
			completed: false,
			created: new Date(),
		},
		{
			id: "2",
			title: "task2",
			completed: false,
			created: new Date(),
		},
	],
);

export default mock(TaskRepositoryImpl, TaskRepositoryMock);
