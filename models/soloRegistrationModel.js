import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    githubLink: {
        type: String,
        required: false,
    },
    isMailSent: {
        type: Boolean,
        default: false,
    },
    isSelected: {
        type: Boolean,
        default: false,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Registration = mongoose.model("solo_registration", registrationSchema);

export default Registration;