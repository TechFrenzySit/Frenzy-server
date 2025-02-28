import express from "express";
const apiRouter = express.Router();
export default apiRouter;

apiRouter.get("/", ( req , res , next ) => {
    return res.status(200).json({
        status: "success",
        message: "Server is running successfully."
    });
});