import express from "express";
import { requireAuth } from "../../../middlewares/requireAuth.js";
import * as orderProductController from "../../../controllers/orderProductController.js";

const orderProductRouter = express.Router();

orderProductRouter.use(requireAuth);

orderProductRouter.get("/", orderProductController.getOrderProducts);
orderProductRouter.post("/", orderProductController.createOrderProduct);
orderProductRouter.put("/:id", orderProductController.updateOrderProduct);
orderProductRouter.delete("/:id", orderProductController.deleteOrderProduct);
orderProductRouter.get("/:id", orderProductController.getOrderProductById);

export default orderProductRouter;
