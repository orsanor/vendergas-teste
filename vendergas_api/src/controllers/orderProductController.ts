import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getOrderProducts = async (req, res) => {
  const items = await prisma.orderProduct.findMany({
    include: { order: true, product: true },
  });
  res.json(items);
};

export const createOrderProduct = async (req, res) => {
  const { orderId, productId, quantity } = req.body;
  const item = await prisma.orderProduct.create({
    data: { orderId, productId, quantity },
  });
  res.status(201).json(item);
};
