import type { ActionFunctionArgs } from "@remix-run/node";
import {
	Link,
	json,
	useFetcher,
	useLoaderData,
	useRevalidator,
	useSubmit,
} from "@remix-run/react";
import { Suspense } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import taskRepository from "~/lib/repositories/taskRepository";

export async function loader() {
	const tasks = await taskRepository.listTask();
	return json({ tasks });
}
export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const intent = formData.get("_intent") as string;
	switch (intent) {
		case "updateCompleted": {
			const taskId = formData.get("taskId") as string;
			await taskRepository.updateTask(taskId, {
				completed: formData.get("completed") === "true",
			});
			break;
		}
		default:
			throw Error(`invalid intent ${intent}`);
	}
	return null;
}

export default function ToDo() {
	const { tasks } = useLoaderData<typeof loader>();
	const submit = useSubmit();
	return (
		<>
			<header className="flex p-5">
				<h1 className="text-3xl font-extrabold">To Do App</h1>
			</header>
			<main>
				<Link to="/example/new" className="ml-5">
					Add Task
				</Link>
				<Suspense fallback={<div>Loading...</div>}>
					<Table>
						<TableCaption>To Do List</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Completed</TableHead>
								<TableHead>Title</TableHead>
								<TableHead className="text-right">Created</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell>
										<Checkbox
											checked={task.completed}
											onCheckedChange={async (v) => {
												submit(
													{
														_intent: "updateCompleted",
														taskId: task.id,
														completed: v === true,
													},
													{ method: "post" },
												);
											}}
										/>
									</TableCell>
									<TableCell>{task.title}</TableCell>
									<TableCell className="text-right">
										{task.created.toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Suspense>
			</main>
		</>
	);
}
