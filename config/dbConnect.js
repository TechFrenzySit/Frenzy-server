import mongoose from "mongoose";

export default async function dbConnect() {
    try {
        const URL = process.env.MONGODB_URI;
        mongoose.connect(URL);

        const db = mongoose.connection;

        db.on("open", ()=> {
            console.log("MongoDB: Connected to database.");
        });

        db.on("error", (err)=> {
            console.error("MongoDB: Error", err);
            process.exit(1);
        });

        mongoose.Promise = global.Promise;
        
    } catch (error) {
        console.error("MongoDB connection failed.");
        console.error(error);
    }
};