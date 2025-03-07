import mongoose from "mongoose";
import { string } from "zod";

const adminSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAT: {
        type: Date,
        default: Date.now,
    },
    loggedIn: {
        token: {
            type: String,
            default: null,
        },
        loggedInAt: {
            type: Date,
            default: null,
        },
    },
    authentication: {
        token: {
            type: String,
            default: null,
        },
        otp: {
            type: Number,
            default: null,
        },
        otpExpire: {
            type: Date,
            default: null,
        }
    },
    updatedAT: {
        type: Date,
        default: Date.now,
    },
});

const admin = mongoose.model("admins", adminSchema);

export default admin;