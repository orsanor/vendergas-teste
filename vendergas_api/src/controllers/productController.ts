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

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const product = await prisma.product.update({
    where: { id: id },
    data: { name, price, description },
  });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: id } });
  res.status(204).send();
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: id },
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
};

export const getProductsByCompany = async (req, res) => {
  const { companyId } = req.params;
  const products = await prisma.product.findMany({
    where: { companyId: Number(companyId) },
  });
  if (products.length === 0) {
    return res
      .status(404)
      .json({ error: "No products found for this company" });
  }
  res.json(products);
};
