import { Router } from "express";
import * as productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/:id", productController.getProductById);

export default router;
