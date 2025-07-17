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

export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { tradeName, legalName, cnpj } = req.body;
  const company = await prisma.company.update({
    where: { id: id },
    data: { tradeName, legalName, cnpj },
  });
  res.json(company);
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  await prisma.company.delete({ where: { id: id } });
  res.status(204).send();
};  

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id: id },
  });
  if (!company) {
    return res.status(404).json({ error: "Company not found" });
  }
  res.json(company);
};
