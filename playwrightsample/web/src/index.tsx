import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { FC } from "hono/jsx";

const app = new Hono();

const Layout: FC = (props) => {
	return (
		<html lang="en">
			<body>{props.children}</body>
		</html>
	);
};

const Top: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
	return (
		<Layout>
			<h1>Hello Hono!</h1>
			<p>Here are the messages.</p>
			<ul>
				{props.messages.map((message) => {
					return <li key={message}>{message}!!</li>;
				})}
			</ul>
		</Layout>
	);
};

app.get("/", (c) => {
	const messages = ["hello world", "hello hono", "hello jsx"];
	return c.html(<Top messages={messages} />);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
