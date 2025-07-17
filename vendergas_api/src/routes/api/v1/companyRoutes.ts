import express from "express";
import * as companyController from "../../../controllers/companyController.js";
import { requireAuth } from "../../../middlewares/requireAuth.js";

const companyRouter = express.Router();

companyRouter.use(requireAuth);

companyRouter.get("/", companyController.getCompanies);
companyRouter.post("/", companyController.createCompany);
companyRouter.put("/:id", companyController.updateCompany);
companyRouter.delete("/:id", companyController.deleteCompany);
companyRouter.get("/:id", companyController.getCompanyById);

export default companyRouter;
