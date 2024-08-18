import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	useEffect(() => {
		if (window) {
			console.table(window.ENV);
		}
	}, []);
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl">Welcome to Remix</h1>
			<ul className="list-disc mt-4 pl-6 space-y-2">
				<li>
					<Link
						className="text-blue-700 underline visited:text-purple-900"
						to="/example"
					>
						To Do App Example
					</Link>
				</li>
				<li>
					<Link
						className="text-blue-700 underline visited:text-purple-900"
						to="/md"
					>
						Markdown Example
					</Link>
				</li>
			</ul>
		</div>
	);
}
