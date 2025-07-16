import { Router } from "express";
import * as orderProductController from "../controllers/orderProductController.js";

const router = Router();

router.get("/", orderProductController.getOrderProducts);
router.post("/", orderProductController.createOrderProduct);
router.put("/:id", orderProductController.updateOrderProduct);
router.delete("/:id", orderProductController.deleteOrderProduct);
router.get("/:id", orderProductController.getOrderProductById);

export default router;
