import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllOrderProducts = async () => {
  return prisma.orderProduct.findMany({
    include: { order: true, product: true },
  });
};

export const createOrderProduct = async (orderProductData) => {
  return prisma.orderProduct.create({
    data: orderProductData,
  });
};

export const getOrderProductById = async (id) => {
  return prisma.orderProduct.findUnique({
    where: { id },
    include: { order: true, product: true },
  });
};

export const updateOrderProduct = async (id, orderProductData) => {
  return prisma.orderProduct.update({
    where: { id },
    data: orderProductData,
  });
};

export const deleteOrderProduct = async (id) => {
  return prisma.orderProduct.delete({
    where: { id },
  });
};

export const getOrderProductsByOrderId = async (orderId) => {
  return prisma.orderProduct.findMany({
    where: { orderId },
    include: { product: true },
  });
};
