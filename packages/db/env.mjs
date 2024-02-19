import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    // DATABASE_URL: process.env.DATABASE_URL,
    // DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    DATABASE_URL: "libsql://xxxxxxxxxxx.io",
    DATABASE_AUTH_TOKEN: "xxxxxxxxxxxx",
  },
  skipValidation: process.env.NODE_ENV === "test",
});
