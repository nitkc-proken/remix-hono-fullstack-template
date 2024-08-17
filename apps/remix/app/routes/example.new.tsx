import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import taskRepository from "~/lib/repositories/taskRepository";

export async function loader() {
	const tasks = await taskRepository.listTask();
	return json({ tasks });
}
export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const result = await taskRepository.addTask(formData.get("title") as string);
	return redirect("/example");
}
export default function ToDo() {
	const navigation = useNavigation();
	return (
		<>
			<header className="flex p-5">
				<h1 className="text-3xl font-extrabold">To Do App</h1>
			</header>
			<main>
				<Form method="post">
					<fieldset disabled={navigation.state === "submitting"}>
						<p>
							<label>
								<Input type="text" name="title" placeholder="Title" />
							</label>
						</p>
						<p>
							<Button type="submit">Add Task</Button>
						</p>
					</fieldset>
				</Form>
			</main>
		</>
	);
}
