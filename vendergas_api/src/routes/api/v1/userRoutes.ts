import express from "express";
import * as userController from "../../../controllers/userController";
import { requireAuth } from "../../../middlewares/requireAuth";

const userRouter = express.Router();

userRouter.use(requireAuth);
// userRouter.post("/", userController.createUser);
userRouter.get("/", userController.fetchUsers);

userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
