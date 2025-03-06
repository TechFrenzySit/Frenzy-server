import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: [true, "Event title already exists"],
    },
    description: {
        type: String,
        required: true,
        unique: [true, "Event title already exists"],
    },
    dates: {
        startingDate: {
            type: Date,
            required: true,
        },
        endingDate: {
            type: Date,
            required: true,
        },
    },
    type: {
        type: String,
        required: true,
        enum: ["solo", "team"],
    },
    registration: {
        startingDate: {
            type: Date,
            required: false,
            default: null,
        },
        endingDate: {
            type: Date,
            required: false,
            default: null,
        },
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
    image: {
        default: null,
        type: String,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("events", eventSchema);