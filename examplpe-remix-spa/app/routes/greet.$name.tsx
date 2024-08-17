import { type ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";

export const clientLoader = async ({
	request,
	params,
}: ClientLoaderFunctionArgs) => {
	console.log(params);
	console.log(request);
	return { params }; // This will be passed to the loader function on the server as
};

export default function Greet() {
	const { params } = useLoaderData<typeof clientLoader>();
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl">Hello, World!</h1>
			<p className="mt-4">This is a Remix SPA route.</p>
			<p className="mt-4">Hello, {params.name}!</p>
		</div>
	);
}
