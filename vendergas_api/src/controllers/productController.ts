import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, price, description, companyId } = req.body;
  const product = await prisma.product.create({
    data: { name, price, description, companyId },
  });
  res.status(201).json(product);
};
