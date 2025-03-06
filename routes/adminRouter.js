import express from "express";

const adminRouter = express.Router();
export default adminRouter;

import { deleteNewsLetter , getNewsLetter , newEvent ,
    getAllEvents , getAllTeamParticipants , uploadNewsletterTemplate ,
    sendMailToAll , eventSetting , editEventSetting , deleteTeamApplicant ,
    sendMailToApplicant } from "../controllers/adminController.js";

adminRouter.delete("/news-letter/remove" , deleteNewsLetter );
adminRouter.get("/news-letter/all" , getNewsLetter );
adminRouter.post("/news-letter/upload-template" , uploadNewsletterTemplate );
adminRouter.post("/news-letter/send-mail" , sendMailToAll );


adminRouter.post("/event/new" , newEvent );
adminRouter.get("/event/all" , getAllEvents );
adminRouter.post("/event/setting" , eventSetting );
adminRouter.patch("/event/setting/edit" , editEventSetting );

adminRouter.get("/event/participants/team/:eventId" , getAllTeamParticipants );
adminRouter.delete("/event/participants/team/applicant/:regId" , deleteTeamApplicant );
adminRouter.post("/event/participants/team/applicant/:id" , sendMailToApplicant );

// adminRouter.get("/event/participants/solo/all" , getAllTeamParticipants );
