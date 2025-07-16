import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getCompanies = async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
};

export const createCompany = async (req, res) => {
  const { tradeName, legalName, cnpj, userId } = req.body;
  const company = await prisma.company.create({
    data: { tradeName, legalName, cnpj, userId },
  });
  res.status(201).json(company);
};
