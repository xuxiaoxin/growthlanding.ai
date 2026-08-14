/**
 * Auth.js (next-auth v5) configuration.
 *
 * - GitHub + Google OAuth providers. With no explicit options they read
 *   AUTH_GITHUB_ID / AUTH_GITHUB_SECRET and AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
 *   from the environment (next-auth v5 convention).
 * - DrizzleAdapter persists users/accounts to Neon. The schema in
 *   src/db/schema.ts mirrors the @auth/drizzle-adapter standard structure.
 * - JWT session strategy: the session lives in an AUTH_SECRET-encrypted cookie,
 *   NOT in the sessions table. This is serverless-friendly (no DB hit per
 *   request) and is why the sessions table stays empty at runtime.
 * - NO middleware/proxy: all auth checks happen via RSC `auth()` inside /app/*
 *   dynamic routes. The static SEO pages never import this module, so SSG is
 *   preserved. See .spec/prd/002-accounts-and-watchlist.md.
 */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions } from "@/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: { strategy: "jwt" },
  providers: [GitHub, Google],
  callbacks: {
    // Persist user.id into the JWT on first sign-in.
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Expose user.id on the session object for server-side use (RSC/actions).
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
