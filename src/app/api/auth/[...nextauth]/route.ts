/**
 * Auth.js route handler — serves /api/auth/* (sign-in, sign-out, callbacks).
 *
 * This is a dynamic route handler (ƒ) confined to /api/auth/*. It does NOT
 * touch the SSG SEO pages.
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
