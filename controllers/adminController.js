import mails from "../models/mails.js";
import events from "../models/events.js";
import teamRegistrationModel from "../models/teamRegistrationModel.js";
import fs from "fs";
import path from "path";

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

        const {
            page = 1,
            limit = 50,
        } = req.query;

        const allEmails = await mails
            .find()
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 })
            .select("-__v -_id -updatedAt")
            .exec();

        const totalEmails = await mails.countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All emails fetched successfully.",
            totalMails: allEmails.length,
            data: allEmails,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalEmails,
                totalPages: Math.ceil(totalEmails / parseInt(limit)),
                more: (parseInt(page) * parseInt(limit)) < totalEmails? true : false,
            }
        });

    } catch (error) {
        next(error);
    };
};

export const uploadNewsletterTemplate = async ( req , res , next ) => {
    try {
            
        const { subject , html } = req.body;

        if(!subject || !html) {
            return res.status(400).json({
                status: "error",
                message: "Subject and html is required.",
            });
        };

        const jsonTemplate = {
            subject,
            html,
        };

        const templatePath = path.join(process.cwd(), "mailTemplates", "newsletterMail.json");

        fs.writeFileSync(templatePath, JSON.stringify(jsonTemplate));

        return res.status(200).json({
            status: "success",
            message: "Mail format uploaded successfully.",
        });

    } catch (error) {
        next(error);
    };
};

export const sendMailToAll = async ( req , res , next ) => {
    try {
        
        const templatePath = path.join(process.cwd(), "mailTemplates", "newsletterMail.json");
        const templateData = fs.readFileSync(templatePath, "utf-8");
        const { subject , html } = JSON.parse(templateData);

        const allEmails = await mails
            .find()
            .sort({ createdAt: 1 })
            .select("-__v -_id -updatedAt -createdAt")
            .exec();

        const mailArray = allEmails.map((mail) => mail.email);

        const mailOptions = {
            from: `Notification <{process.env.EMAIL}>`,
            to: mailArray,
            subject,
            html,
        };

        return res.status(200).json({
            status: "success",
            message: "Sending mails.",
            data: mailArray,
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
            isOpenL: false,
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

export const getAllEvents = async ( req , res , next ) => {
    try {

        const allEvents = await events.find({});

        return res.status(200).json({
            status: "success",
            message: "All events fetched successfully.",
            data: allEvents,
        });

    } catch (error) {
        next(error);
    };
};

export const getAllTeamParticipants = async ( req , res , next ) => {
    try {

        const allParticipants = await teamRegistrationModel.find({});

        return res.status(200).json({
            status: "success",
            message: "All participants fetched successfully.",
            data: allParticipants,
        });

    } catch (error) {
        next(error);
    };
};

export const eventSetting = async ( req , res , next ) => {
    try {

        const { eventId } = req.body;

        const {
            startingDate,
            endingDate
        } = req.body;

        const event = await events.findById(eventId);

        if (!event) {
            return res.status(400).json({
                status: "error",
                message: "Event not found.",
            });
        };

        event.registration.startingDate = Date(startingDate);
        event.registration.endingDate = Date(endingDate);
        event.isOpen = true;

        await event.save();

        return res.status(200).json({
            status: "success",
            message: "Event setting fetched successfully.",
            data: event,
        });

    } catch (error) {
        next(error);
    };
};