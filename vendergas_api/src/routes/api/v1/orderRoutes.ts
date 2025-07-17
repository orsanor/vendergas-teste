import express from "express";
import { requireAuth } from "../../../middlewares/requireAuth.js";
import * as orderController from "../../../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.use(requireAuth);

orderRouter.get("/", orderController.getOrders);
orderRouter.post("/", orderController.createOrder);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.delete("/:id", orderController.deleteOrder);
orderRouter.get("/:id", orderController.getOrderById);

export default orderRouter;
