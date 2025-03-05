import express from "express";

const adminRouter = express.Router();
export default adminRouter;

import { deleteNewsLetter } from "../controllers/adminController.js";

adminRouter.delete("/news-letter/remove" , deleteNewsLetter );