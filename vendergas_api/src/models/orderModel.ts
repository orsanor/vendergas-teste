import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { client: true, company: true, orderProducts: true },
  });
};

export const createOrder = async (orderData) => {
  return prisma.order.create({
    data: orderData,
  });
};

export const getOrderById = async (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: { client: true, company: true, orderProducts: true },
  });
};

export const updateOrder = async (id, orderData) => {
  return prisma.order.update({
    where: { id },
    data: orderData,
  });
};

export const deleteOrder = async (id) => {
  return prisma.order.delete({
    where: { id },
  });
};

export const getOrdersByClientId = async (clientId) => {
  return prisma.order.findMany({
    where: { clientId },
    include: { company: true, orderProducts: true },
  });
};
