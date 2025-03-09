import express from "express";
const apiRouter = express.Router();
export default apiRouter;

import adminRouter from "./adminRouter.js";
import { registrationTeam , registrationSolo , getAllPastEvents ,
    getCurrentEvent , newsLetter , getAllImagesByEvent } from "../controllers/registrationController.js";
import { adminAuthentication , verifyOtp , createAdmin } from "../controllers/adminAuthentication.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

apiRouter.get("/", ( req , res , next ) => {
    return res.status(200).json({
        status: "success",
        message: "Server is running successfully."
    });
});

apiRouter.post("/registration/team" , registrationTeam );
apiRouter.post("/registration/solo" , registrationSolo );
apiRouter.post("/news-letter" , newsLetter );
apiRouter.get("/past-events" , getAllPastEvents );
apiRouter.get("/current-event" , getCurrentEvent );
apiRouter.get("/images/events/all" , getAllImagesByEvent );
apiRouter.post("/admin/auth" , adminAuthentication );
apiRouter.post("/admin/verify-otp" , verifyOtp );
apiRouter.post("/admin/create" , verifyAdmin , createAdmin );
apiRouter.use("/admin" , verifyAdmin , adminRouter );