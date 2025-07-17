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
  const { name, email, phone } = req.body;
  const client = await prisma.client.update({
    where: { id: id },
    data: { name, email, phone },
  });
  res.json(client);
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;
  await prisma.client.delete({ where: { id: id } });
  res.status(204).send();
};

export const getClientById = async (req, res) => {
  const { id } = req.params;
  const client = await prisma.client.findUnique({
    where: { id: id },
  });
  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }
  res.json(client);
};
