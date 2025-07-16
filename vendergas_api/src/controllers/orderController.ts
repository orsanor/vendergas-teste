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
