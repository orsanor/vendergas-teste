import express from "express";
import { requireAuth } from "../../../middlewares/requireAuth.js";
import * as productController from "../../../controllers/productController.js";

const productRouter = express.Router();

productRouter.use(requireAuth);

productRouter.get("/", productController.getProducts);
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.get("/:id", productController.getProductById);

export default productRouter;
