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

export const updateOrderProduct = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const item = await prisma.orderProduct.update({
    where: { id: id },
    data: { quantity },
  });
  res.json(item);
};

export const deleteOrderProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.orderProduct.delete({ where: { id: id } });
  res.status(204).send();
};

export const getOrderProductById = async (req, res) => {
  const { id } = req.params;
  const item = await prisma.orderProduct.findUnique({
    where: { id: id },
    include: { order: true, product: true },
  });
  if (!item) {
    return res.status(404).json({ error: "Order product not found" });
  }
  res.json(item);
};
