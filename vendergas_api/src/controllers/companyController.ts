import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export const getCompanies = async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Não autenticado" });
  const companies = await prisma.company.findMany({
    where: { userId },
  });
  res.json(companies);
};

export const createCompany = async (req, res) => {
  const { tradeName, legalName, cnpj } = req.body;
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Não autenticado" });
  const company = await prisma.company.create({
    data: { tradeName, legalName, cnpj, userId },
  });
  res.status(201).json(company);
};

export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { tradeName, legalName, cnpj } = req.body;
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Não autenticado" });
  const company = await prisma.company.findUnique({ where: { id, userId } });
  if (!company) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  const updated = await prisma.company.update({
    where: { id },
    data: { tradeName, legalName, cnpj },
  });
  res.json(updated);
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Não autenticado" });
  const company = await prisma.company.findUnique({ where: { id, userId } });
  if (!company) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  await prisma.company.delete({ where: { id } });
  res.status(204).send();
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Não autenticado" });
  const company = await prisma.company.findUnique({
    where: { id: id, userId },
  });
  if (!company) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  res.json(company);
};
