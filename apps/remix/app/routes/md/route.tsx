import { Outlet } from "@remix-run/react";
import "./markdown.css";
export default function Route() {
	return (
		<div className={"md-docs"}>
			<Outlet />
		</div>
	);
}
