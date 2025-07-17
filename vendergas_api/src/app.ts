import express from "express";
import userRoutes from "./routes/api/v1/userRoutes";
import companyRoutes from "./routes/api/v1/companyRoutes";
import clientRoutes from "./routes/api/v1/clientRoutes";
import productRoutes from "./routes/api/v1/productRoutes";
import orderRoutes from "./routes/api/v1/orderRoutes";
import orderProductRoutes from "./routes/api/v1/orderProductRoutes";
import cors from "cors";
import { auth } from "./utils/auth";
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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-products", orderProductRoutes);

export default app;
