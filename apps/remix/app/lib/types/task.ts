export type Task = {
	id: string;
	title: string;
	completed: boolean;
	created: Date;
};

export type TaskContents = Pick<Task, "title" | "completed">;
