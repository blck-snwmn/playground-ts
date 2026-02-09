type Head = {
  title?: string;
};

declare module "hono" {
  // biome-ignore lint/complexity/noBannedTypes: Empty object is needed for HonoX type extension
  type Env = {};
  type ContextRenderer = (
    content: string | Promise<string>,
    head?: Head,
  ) => Response | Promise<Response>;
}
