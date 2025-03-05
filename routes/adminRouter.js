import express from "express";

const adminRouter = express.Router();
export default adminRouter;

import { deleteNewsLetter , getNewsLetter , newEvent , getAllEvents } from "../controllers/adminController.js";

adminRouter.delete("/news-letter/remove" , deleteNewsLetter );
adminRouter.get("/news-letter/all" , getNewsLetter );


adminRouter.post("/event/new" , newEvent );
adminRouter.get("/event/all" , getAllEvents );
