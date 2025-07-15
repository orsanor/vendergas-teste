import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  return await prisma.users.findMany();
};

export const createUser = async (userData) => {
  return await prisma.users.create({
    data: userData,
  });
};
