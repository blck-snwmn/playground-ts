import {
	type ClientActionFunctionArgs,
	Form,
	redirect,
	useActionData,
} from "@remix-run/react";
import { useId } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
	const data = await request.formData();
	const name = data.get("name");
	if (!name) {
		return { error: "Name is required" };
	}
	return redirect(`/greet/${name}`);
};

export default function Greet() {
	const resp = useActionData<typeof clientAction>();
	const nameInputId = useId();
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl">Hello, World!</h1>
			<p className="mt-4">This is a Remix SPA route.</p>
			<Form method="post" action="/greet">
				<Label htmlFor={nameInputId}>Name</Label>
				<Input name="name" id={nameInputId} className="w-60" />
				<Button type="submit" className="my-3">
					Greet
				</Button>
			</Form>
			{resp?.error ? <p className="text-red-500 mt-4">{resp.error}</p> : null}
		</div>
	);
}
