import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/nextjs";

export const { POST, GET } = toNextJsHandler(auth)