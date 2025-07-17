import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  BASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  BETTER_AUTH_SECRET: z.string().regex(/^[0-9a-f]{64}$/),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_CLOUD_NAME: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log(_env.error);

  console.log(_env.error.message);

  throw new Error(`Error occured with the env file : ${_env.error.message}`);
}

export const env = _env.data;
