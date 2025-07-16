import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getClients = async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
};

export const createClient = async (req, res) => {
  const { name, email, phone, companyId } = req.body;
  const client = await prisma.client.create({
    data: { name, email, phone, companyId },
  });
  res.status(201).json(client);
};
