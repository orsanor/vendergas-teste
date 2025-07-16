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

export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const client = await prisma.client.update({
    where: { id: Number(id) },
    data: { name, email, phone },
  });
  res.json(client);
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;
  await prisma.client.delete({ where: { id: Number(id) } });
  res.status(204).send();
};

export const getClientById = async (req, res) => {
  const { id } = req.params;
  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
  });
  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }
  res.json(client);
};
