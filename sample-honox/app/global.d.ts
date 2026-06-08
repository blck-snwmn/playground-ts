type Head = {
  title?: string;
};

declare module "hono" {
  type Env = Record<string, never>;
  type ContextRenderer = (
    content: string | Promise<string>,
    head?: Head,
  ) => Response | Promise<Response>;
}
