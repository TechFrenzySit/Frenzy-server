import express from "express";
const apiRouter = express.Router();
export default apiRouter;

import adminRouter from "./adminRouter.js";
import { registrationTeam , registrationSolo , getAllPastEvents ,
    getCurrentEvent } from "../controllers/registrationController.js";

apiRouter.get("/", ( req , res , next ) => {
    return res.status(200).json({
        status: "success",
        message: "Server is running successfully."
    });
});

apiRouter.post("/registration/team" , registrationTeam );
apiRouter.post("/registration/solo" , registrationSolo );
apiRouter.get("/past-events" , getAllPastEvents );
apiRouter.get("/current-event" , getCurrentEvent );
apiRouter.use("/admin" , adminRouter );