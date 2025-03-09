import admin from "../models/admin.js";
import { generateToken , verifyToken } from "../utils/jwtToken.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from "../utils/sendMail.js";

export const adminAuthentication = async ( req , res , next ) => {
    try {

        const { email , password } = req.body;

        if( !email || !password ) {
            return res.status(400).json({
                status: "error",
                message: "Please provide email and password."
            });
        };


        console.log(2);

        let adminData = await admin.findOne({ email });
        console.log(33);

        console.log(adminData);
        const token = crypto.randomBytes(32).toString("hex");
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        if ( !adminData ) {
            
            if(process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
                
                console.log("A");
                
                const jsonAdmin = {
                    email: email,
                    password: await bcrypt.hash(password + "|" + process.env.SERVER_SIGNATURE, 8),
                    authentication: {
                        token,
                        otp,
                        otpExpire,
                    }
                }
                console.log(jsonAdmin);
                adminData = new admin(jsonAdmin);
                console.log("C");
                
            }else{
                return res.status(400).json({
                    status: "error",
                    message: "Invalid email or password."
                });
            };
        }else{
            
            const isPasswordMatched = await bcrypt.compare(password + "|" + process.env.SERVER_SIGNATURE, adminData.password);

            if( !isPasswordMatched ) {
                return res.status(400).json({
                    status: "error",
                    message: "Wrong password!"
                });
            };

            adminData.authentication = {
                token,
                otp,
                otpExpire,
            };
        };

        console.log("B");

        await adminData.save();

        const mailOptions = {
            from: `Admin <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "Admin Login OTP",
            text: `Your OTP is ${otp}.`
        };

        console.log(1);
        const isMailSent = await sendMail(mailOptions);
        console.log(11);

        if( !isMailSent ) {
            return res.status(400).json({
                status: "success",
                message: "Unable to send OTP to your email."
            });
        };

        const newToken = generateToken({
            token: adminData.authentication.token,
            id: adminData._id
        })

        return res.status(200).json({
            status: "success",
            message: "OTP sent to your email.",
            otpToken: newToken,
        });

    } catch (error) {
        next(error);
    };
};

export const verifyOtp = async ( req , res , next ) => {
    try {

        const otp = parseInt(req.body.otp, 10);

        if(otp === NaN) {
            return res.status(400).json({
                status: "error",
                message: "Invalid OTP."
            });
        };

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
        
        if( adminData.authentication.otpExpire < Date.now() ) {
            return res.status(400).json({
                status: "error",
                message: "OTP expired."
            });
        };

        if( adminData.authentication.token !== decoded.token ) {
            return res.status(400).json({
                status: "error",
                message: "Invalid token."
            });
        };

        if( adminData.authentication.otp !== otp ) {
            return res.status(400).json({
                status: "error",
                message: "Invalid OTP."
            });
        };

        const hexToken = crypto.randomBytes(32).toString("hex");

        adminData.loggedIn.token = hexToken;
        adminData.loggedIn.loggedInAt = new Date();
        adminData.authentication.otp = null;
        adminData.authentication.otpExpire = null;
        adminData.authentication.token = null;

        await adminData.save();

        const newToken = generateToken({
            token: adminData.loggedIn.token,
            id: adminData._id
        });

        return res.status(200).json({
            status: "success",
            message: "Logged in successfully.",
            token: newToken
        });

    } catch (error) {
        next(error);
    };
};

export const createAdmin = async ( req , res , next ) => {
    try {

        const email = req.body.email;

        if( !email ) {
            return res.status(400).json({
                status: "error",
                message: "Please provide email."
            });
        };

        const adminData = await admin.findOne({ email });

        if( adminData ) {
            return res.status(400).json({
                status: "error",
                message: "Admin already exists."
            });
        };

        // generate a 8 character password

        const unhashedPassword = Math.random().toString(36).slice(-8);

        const newAdmin = new admin({
            email: email,
            password: await bcrypt.hash(unhashedPassword + "|" + process.env.SERVER_SIGNATURE, 8),
        });

        // send mail to the admin with the password

        const mailOptions = {
            from: `Admin <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "Congratulations | Admin Password",
            html: `Contratulations!<br> Your you are now a new admin of Tech-Frenzy <br>Your password is ${unhashedPassword}.`
        };

        const isMailSent = await sendMail(mailOptions);

        if( !isMailSent ) {
            return res.status(400).json({
                status: "error",
                message: "Unable to send mail."
            });
        };

        await newAdmin.save();

        return res.status(200).json({
            status: "success",
            message: "Admin created successfully."
        });

    } catch (error) {
        next(error);
    };
};