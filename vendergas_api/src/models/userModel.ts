import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAllUsers = async () => prisma.user.findMany();

export const createUser = async (userData: any) =>
  prisma.user.create({ data: userData });

export const getUserById = async (id: string) =>
  prisma.user.findUnique({ where: { id } });

export const updateUser = async (id: string, userData: any) =>
  prisma.user.update({ where: { id }, data: userData });

export const deleteUser = async (id: string) =>
  prisma.user.delete({ where: { id } });
