import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { client: true, company: true, orderProducts: true },
  });
  res.json(orders);
};

export const createOrder = async (req, res) => {
  const { number, notes, clientId, companyId } = req.body;
  const order = await prisma.order.create({
    data: { number, notes, clientId, companyId },
  });
  res.status(201).json(order);
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { number, notes } = req.body;
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: { number, notes },
  });
  res.json(order);
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  await prisma.order.delete({ where: { id: Number(id) } });
  res.status(204).send();
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { client: true, company: true, orderProducts: true },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
};
