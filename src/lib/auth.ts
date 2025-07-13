import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { env } from "../../env";
import { hash as bcryptHash } from "bcryptjs";

const adminRole = "admin";
const userRole = "user";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    minPasswordLength: 4,
    maxPasswordLength: 128,
    autoSignIn: true,
    password: {
      hash: async (password: string) => {
        const hashedPassword = await bcryptHash(password, 10);
        return hashedPassword;
      },
    },
  },

  socialProviders: {
    google: {
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      clientId: env.GOOGLE_CLIENT_ID,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: userRole,
        };
      },
    },
  },
  plugins: [
    admin({
      adminRoles: [adminRole],
      defaultRole: userRole,
    }),
    nextCookies(),
  ],
});
