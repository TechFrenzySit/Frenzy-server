import fs from "fs/promises";
import path from "path";

const errorHandlerMiddleware = async (error, req, res, next) => {
    const filePath = path.join(process.cwd(), "logs", "internalServerError.log");

    try {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.appendFile(filePath, `Error: ${new Date().toLocaleString()}\n${error.stack || error.message || "No stack trace"}\n\n`);

        res.status(500).send({
            status: "error",
            message: process.env.NODE_ENV === "production" ? "Something went wrong, try again after some time." : error.message,
        });
    } catch {
        res.status(500).send({ status: "error", message: "Internal server error" });
    }
};

export default errorHandlerMiddleware;
