import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({

    teamName: {
        type: String,
        required: true,
        minlength: [3, "Team name must be at least 3 characters long"],
        maxlength: [80, "Team name must be at most 80 characters long"],
    },
    topicName: {
        type: String,
        required: true,
        minlength: [3, "Topic name must be at least 3 characters long"],
        maxlength: [200, "Topic name must be at most 200 characters long"],
    },
    topicDescription: {
        type: String,
        required: true,
        minlength: [3, "Topic description must be at least 3 characters long"],
        maxlength: [500, "Topic description must be at most 500 characters long"],
    },
    teamLeader: {
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
            unique: true,
        },
        department: {
            type: String,
            required: false,
        },
        year: {
            type: String,
            required: false,
        },
        githubLink: {
            type: String,
            required: false,
        },
    },
    isMailSent: {
        type: Boolean,
        default: false,
    },
    isSelected: {
        type: Boolean,
        default: false,
    },
    numberOfMembers: {
        type: Number,
        required: true,
        min: [1, "Number of members must be at least 1"],
        max: [5, "Number of members must be at most 5"],
    },
    teamMembers: [
        {
            name: {
                type: String,
                required: true
            },
            department: {
                type: String,
                required: false,
            },
            year: {
                type: String,
                required: false
            },
        },
    ],
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

const Registration = mongoose.model("team_registration", registrationSchema);

export default Registration;