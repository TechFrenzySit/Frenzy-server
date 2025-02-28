import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import api from "./routes/api.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

configDotenv();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/", express.static("public"));

app.use("/api", api );

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});