import express from "express";
import * as clientController from "../../../controllers/clientController.js";
import { requireAuth } from "../../../middlewares/requireAuth.js";

const clientRouter = express.Router();

clientRouter.use(requireAuth);

clientRouter.get("/", clientController.getClients);
clientRouter.post("/", clientController.createClient);
clientRouter.put("/:id", clientController.updateClient);
clientRouter.delete("/:id", clientController.deleteClient);
clientRouter.get("/:id", clientController.getClientById);

export default clientRouter;
