import express from "express";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", userController.fetchUsers);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
