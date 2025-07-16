import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllClients = async () => {
  return prisma.client.findMany({ include: { company: true } });
};

export const createClient = async (clientData) => {
  return prisma.client.create({
    data: clientData,
  });
};
export const getClientById = async (id) => {
  return prisma.client.findUnique({
    where: { id },
    include: { company: true },
  });
};

export const updateClient = async (id, clientData) => {
  return prisma.client.update({
    where: { id },
    data: clientData,
  });
};

export const deleteClient = async (id) => {
  return prisma.client.delete({
    where: { id },
  });
};

export const getClientsByCompanyId = async (companyId) => {
  return prisma.client.findMany({
    where: { companyId },
  });
};
