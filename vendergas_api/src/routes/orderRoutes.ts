import { Router } from "express";
import * as orderController from "../controllers/orderController.js";

const router = Router();

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get("/:id", orderController.getOrderById);


export default router;
