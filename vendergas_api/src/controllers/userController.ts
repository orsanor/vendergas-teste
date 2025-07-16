import * as userModel from "../models/userModel.js";

export const fetchUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await userModel.createUser({ name, email, password });
    res.send("Usuário criado com sucesso");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    await userModel.updateUser(id, { name, email, password });
    res.send("Usuário atualizado com sucesso");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    res.send("Usuário deletado com sucesso");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).send("Error fetching user by ID");
  }
};
