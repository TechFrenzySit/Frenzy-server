import express from "express";
const apiRouter = express.Router();
export default apiRouter;

import { registration , newsLetter } from "../controllers/registrationController.js";

apiRouter.get("/", ( req , res , next ) => {
    return res.status(200).json({
        status: "success",
        message: "Server is running successfully."
    });
});

apiRouter.post("/registration" , registration );
apiRouter.post("/news-letter" , newsLetter );