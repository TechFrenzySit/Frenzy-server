import admin from "../models/admin.js";
import { generateToken , verifyToken } from "../utils/jwtToken.js";
import bcrypt from 'bcryptjs';

export const verifyAdmin = async ( req , res , next ) => {
    try {

        const token = req.headers.authorization.split(" ")[1];

        const decoded = verifyToken(token);

        if( !decoded ) {
            return res.status(400).json({
                status: "error",
                message: "Invalid token."
            });
        };

        const adminData = await admin.findById(decoded.id);

        if( !adminData ) {
            return res.status(400).json({
                status: "error",
                message: "Invalid token."
            });
        };

        if( adminData.loggedIn.token !== decoded.token ) {
            return res.status(400).json({
                status: "error",
                message: "Token expired."
            });

        };
        
        req.adminData = adminData;
        next();

    } catch (error) {
        next(error);
    };
};