import { PrismaClient } from "../../generated/prisma/index.js";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  session?: {
    user?: {
      id: string;
    };
  };
}

const prisma = new PrismaClient();

export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.session?.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const products = await prisma.product.findMany({
    where: {
      company: {
        userId: userId,
      },
    },
  });
  res.json(products);
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { name, price, description, companyId } = req.body;
  const userId = req.session?.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado à empresa" });
  }

  const product = await prisma.product.create({
    data: { name, price, description, companyId },
  });
  res.status(201).json(product);
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, price, description, companyId } = req.body;
  const userId = req.session?.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!product || product.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { name, price, description, companyId },
  });
  res.json(updated);
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!product || product.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
};

export const getProductById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  if (product.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  res.json(product);
};

export const getProductsByCompany = async (req: AuthenticatedRequest, res: Response) => {
  const { companyId } = req.params;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado à empresa" });
  }

  const products = await prisma.product.findMany({
    where: { companyId: companyId },
  });

  res.json(products);
};
