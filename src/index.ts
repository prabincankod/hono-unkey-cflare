import { Unkey } from "@unkey/api";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";


type Bindings = {
  UNKEY_ROOT_KEY: string;
  UNKEY_API_ID: string;
};
const app = new Hono<{ Bindings: Bindings }>();

// kind of like a middleware in express, this intercepts all requests to /api/* and checks if the token is valid
app.use(
  "/api/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const unkey = new Unkey({
        rootKey: c.env.UNKEY_ROOT_KEY,
      });

      const { result, error } = await unkey.keys.verify({
        key: token,
        apiId: c.env.UNKEY_API_ID,
      });

      if (error) {
        return false;
      }

      return result.valid;
    },
  })
);

// this is protected because it falls under the /api/* path
app.get("/api/news", async (c) => {
  return c.text("Voila , Drinks on the house.");
});

export default app;
