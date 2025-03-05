import mails from "../models/mails.js";
import events from "../models/events.js";

import { createEventSchema } from "../utils/zodSchema.js";

export const deleteNewsLetter = async ( req , res , next ) => {
    try {

        const { email } = req.body;

        const existingEmail = await mails.exists({ email });

        if (!existingEmail) {
            return res.status(400).json({
                status: "error",
                message: "Email not found.",
            });
        };

        await mails.deleteOne({ email });

        return res.status(200).json({
            status: "success",
            message: "Unsubscribed from news letter successfully."
        });

    } catch (error) {
        next(error);
    };
};

export const getNewsLetter = async ( req , res , next ) => {
    try {

        const allEmails = await mails.find({});

        return res.status(200).json({
            status: "success",
            message: "All emails fetched successfully.",
            data: allEmails,
        });

    } catch (error) {
        next(error);
    };
};

export const newEvent = async ( req , res , next ) => {
    try {

        const validatedData = createEventSchema.safeParse(req.body);

        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: validatedData.error.message,
            });
        };

        const newEv = new events({
            ...validatedData.data,
            isOpenL: true,
        });

        await newEv.save();

        return res.status(200).json({
            status: "success",
            message: "Event created successfully.",
            data: newEv,
        });

    } catch (error) {
        next(error);
    };
};