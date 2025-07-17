import express from "express";
import companyRoutes from "./routes/api/v1/companyRoutes.js";
import clientRoutes from "./routes/api/v1/clientRoutes.js";
import productRoutes from "./routes/api/v1/productRoutes.js";
import orderRoutes from "./routes/api/v1/orderRoutes.js";
import orderProductRoutes from "./routes/api/v1/orderProductRoutes.js";
import cors from "cors";
import { auth } from "./utils/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-products", orderProductRoutes);

export default app;
