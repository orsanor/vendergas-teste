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
