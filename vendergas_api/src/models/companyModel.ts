import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getAllCompanies = async () => prisma.company.findMany();

export const createCompany = async (data: any) =>
  prisma.company.create({ data });

export const getCompanyById = async (id: string) =>
  prisma.company.findUnique({ where: { id } });

export const updateCompany = async (id: string, data: any) =>
  prisma.company.update({ where: { id }, data });

export const deleteCompany = async (id: string) =>
  prisma.company.delete({ where: { id } });
