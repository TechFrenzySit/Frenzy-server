import express from "express";

const adminRouter = express.Router();
export default adminRouter;

import { deleteNewsLetter , getNewsLetter , newEvent ,
    getAllEvents , getAllTeamParticipants , uploadNewsletterTemplate ,
    sendMailToAll } from "../controllers/adminController.js";

adminRouter.delete("/news-letter/remove" , deleteNewsLetter );
adminRouter.get("/news-letter/all" , getNewsLetter );
adminRouter.post("/news-letter/upload-template" , uploadNewsletterTemplate );
adminRouter.post("/news-letter/send-mail" , sendMailToAll );


adminRouter.post("/event/new" , newEvent );
adminRouter.get("/event/all" , getAllEvents );

adminRouter.get("/event/participants/all" , getAllTeamParticipants );
