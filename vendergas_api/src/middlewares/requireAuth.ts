import { auth } from "../utils/auth";
import { toNodeMiddleware } from "better-auth/node";

export const requireAuth = toNodeMiddleware(auth, {
  jwt: true, 
});
