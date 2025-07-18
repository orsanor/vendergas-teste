import { PrismaClient } from "../../generated/prisma";
import { getClientsByCompanyId } from "../models/clientModels.js";
const prisma = new PrismaClient();

export const getClients = async (req, res) => {
  const { companyId } = req.query;
  if (!companyId)
    return res.status(400).json({ error: "companyId é obrigatório" });

  try {
    const clients = await getClientsByCompanyId(companyId);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
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
  const { name, email, phone, companyId } = req.body;
  const userId = req.session?.user?.id;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { company: true },
  });
  const newCompany = await prisma.company.findUnique({
    where: { id: companyId, userId },
  });
  if (!client || !newCompany) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  const updated = await prisma.client.update({
    where: { id },
    data: { name, email, phone, companyId },
  });
  res.json(updated);
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!client || client.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  await prisma.client.delete({ where: { id } });
  res.status(204).send();
};

export const getClientById = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;
  const client = await prisma.client.findUnique({
    where: { id: id },
    include: { company: true },
  });
  if (!client || client.company.userId !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  res.json(client);
};
