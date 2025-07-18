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

export const getOrderProducts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.session?.user?.id;
  const { orderId, companyId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const whereClause: any = {
    order: {
      company: {
        userId: userId,
      },
    },
  };

  if (orderId) {
    whereClause.orderId = String(orderId);
  }

  if (companyId) {
    whereClause.order = {
      ...whereClause.order,
      companyId: String(companyId),
    };
  }

  const items = await prisma.orderProduct.findMany({
    where: whereClause,
    include: {
      order: {
        include: {
          client: true,
          company: true,
        },
      },
      product: true,
    },
  });
  res.json(items);
};

export const createOrderProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { orderId, productId, quantity } = req.body;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { company: true },
  });

  if (!order || order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado ao pedido" });
  }

  const item = await prisma.orderProduct.create({
    data: { orderId, productId, quantity },
    include: { order: true, product: true },
  });
  res.status(201).json(item);
};

export const updateOrderProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { quantity, productId } = req.body;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const orderProduct = await prisma.orderProduct.findUnique({
    where: { id },
    include: {
      order: {
        include: { company: true },
      },
    },
  });

  if (!orderProduct || orderProduct.order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const updateData: any = {};
  if (quantity !== undefined) updateData.quantity = quantity;
  if (productId !== undefined) updateData.productId = productId;

  const item = await prisma.orderProduct.update({
    where: { id },
    data: updateData,
    include: { order: true, product: true },
  });
  res.json(item);
};

export const deleteOrderProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const orderProduct = await prisma.orderProduct.findUnique({
    where: { id },
    include: {
      order: {
        include: { company: true },
      },
    },
  });

  if (!orderProduct || orderProduct.order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  await prisma.orderProduct.delete({ where: { id } });
  res.status(204).send();
};

export const getOrderProductById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const item = await prisma.orderProduct.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          client: true,
          company: true,
        },
      },
      product: true,
    },
  });

  if (!item) {
    return res.status(404).json({ error: "Produto do pedido não encontrado" });
  }

  if (item.order.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  res.json(item);
};
