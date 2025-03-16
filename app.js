import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import api from "./routes/api.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import securityMiddleware from "./middlewares/securityMiddleware.js";
import accessHandler from "./middlewares/accessHandler.js";
import dbConnect from "./config/dbConnect.js";

configDotenv();

const app = express();

await dbConnect();
securityMiddleware(app);
app.set("trust proxy", true);
app.use(accessHandler);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/files", express.static("public"));

app.use("/api", api );

app.use(errorHandlerMiddleware);

// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// });

export default app;