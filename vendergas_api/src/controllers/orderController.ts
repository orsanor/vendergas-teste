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

function generateOrderNumber() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.session?.user?.id;
  const { companyId } = req.query;
  
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const whereClause: any = {
    company: {
      userId: userId,
    },
  };

  if (companyId) {
    whereClause.companyId = String(companyId);
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: { client: true, company: true, orderProducts: true },
  });
  res.json(orders);
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { notes, clientId, companyId } = req.body;
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

  const number = generateOrderNumber();
  const date = new Date();
  const order = await prisma.order.create({
    data: {
      number,
      notes,
      date,
      clientId,
      companyId,
    },
    include: { orderProducts: true },
  });
  res.status(201).json(order);
};

export const getProductsByCompany = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { companyId } = req.query;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (!companyId) {
    return res.status(400).json({ error: "companyId obrigatório" });
  }

  const company = await prisma.company.findUnique({
    where: { id: String(companyId) },
  });

  if (!company || company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado à empresa" });
  }

  const products = await prisma.product.findMany({
    where: { companyId: String(companyId) },
  });
  res.json(products);
};

export const updateOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { notes, clientId } = req.body;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!order || order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { notes, clientId },
  });
  res.json(updated);
};

export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!order || order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  await prisma.orderProduct.deleteMany({
    where: { orderId: id },
  });

  await prisma.order.delete({ where: { id } });
  res.status(204).send();
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const order = await prisma.order.findUnique({
    where: { id: id },
    include: { client: true, company: true, orderProducts: true },
  });

  if (!order || order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  res.json(order);
};
