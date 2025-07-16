import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllProducts = async () => {
  return prisma.product.findMany({ include: { company: true } });
};

export const createProduct = async (productData) => {
  return prisma.product.create({
    data: productData,
  });
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: { company: true },
  });
};

export const updateProduct = async (id, productData) => {
  return prisma.product.update({
    where: { id },
    data: productData,
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id },
  });
};
