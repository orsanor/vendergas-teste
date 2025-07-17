import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../utils/auth"; 

export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  req.session = session;
  next();
}
