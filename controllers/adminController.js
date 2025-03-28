import mails from "../models/mails.js";
import events from "../models/events.js";
import teamRegistrationModel from "../models/teamRegistrationModel.js";
import soloRegistrationModel from "../models/soloRegistrationModel.js";
import { sendMail } from "../utils/sendMail.js";
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
            from: `Notification <${process.env.EMAIL_USER}>`,
            bcc: mailArray.join(","),
            subject,
            html,
        };

        const isSent = await sendMail(mailOptions);

        if(!isSent) {
            return res.status(400).json({
                status: "error",
                message: "Error in sending mails.",
            });
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

        const currentDate = new Date();
        const saveStartingDate = new Date(validatedData.data.timerDates.startingDate);
        const saveEndingDate = new Date(validatedData.data.timerDates.endingDate);

        if(saveStartingDate > saveEndingDate) {
            return res.status(400).json({
                status: "error",
                message: "Starting date should be less than ending date.",
            });
        };

        if(saveStartingDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Starting date should be greater than current date.",
            });
        };

        if(saveEndingDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Ending date should be greater than current date.",
            });
        };

        const newEv = new events({
            ...validatedData.data,
            isOpen: false,
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

        const allEvents = await events.find({}).sort(
            { createdAt: -1 }
        );

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

        const allParticipants = await teamRegistrationModel.find({
            event: req.params.eventId,
        });

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

        const currentDate = new Date();
        const saveStartingDate = new Date(startingDate);
        const saveEndingDate = new Date(endingDate);

        if(saveStartingDate > saveEndingDate) {
            return res.status(400).json({
                status: "error",
                message: "Starting date should be less than ending date.",
            });
        };

        if(saveStartingDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Starting date should be greater than current date.",
            });
        };

        if(saveEndingDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Ending date should be greater than current date.",
            });
        };

        event.registrationDates = {
            startingDate: saveStartingDate,
            endingDate: saveEndingDate
        };
        event.isOpen = true;

        await event.save();

        return res.status(200).json({
            status: "success",
            message: "Setting changed successfully.",
            data: event,
        });

    } catch (error) {
        next(error);
    };
};

export const editEventSetting = async ( req , res , next ) => {
    try {

        const { eventId } = req.body;

        const {
            isTimer = false,
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

        const currentDate = new Date();
        const saveStartingDate = new Date(startingDate);
        const saveEndingDate = new Date(endingDate);

        if(saveStartingDate > saveEndingDate) {
            return res.status(400).json({
                status: "error",
                message: "Starting date should be less than ending date.",
            });
        };

        if(saveStartingDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Starting date should be greater than current date.",
            });
        };

        if(saveEndingDate < currentDate) {
            return res.status(400).json({
                status: "error",
                message: "Ending date should be greater than current date.",
            });
        };

        if(isTimer) {
            event.timerDates.startingDate = saveStartingDate;
            event.timerDates.endingDate = saveEndingDate;
        } else {
            event.registrationDates.startingDate = saveStartingDate;
            event.registrationDates.endingDate = saveEndingDate;
        };

        await event.save();

        return res.status(200).json({
            status: "success",
            message: "Edited successfully.",
            data: event,
        });

    } catch (error) {
        next(error);
    };
};

export const deleteTeamApplicant = async ( req , res , next ) => {
    try {

        const { regId } = req.params;

        const applicant = await teamRegistrationModel.findById(regId);

        if (!applicant) {
            return res.status(400).json({
                status: "error",
                message: "Applicant not found.",
            });
        };

        await applicant.deleteOne();

        return res.status(200).json({
            status: "success",
            message: "Applicant deleted successfully.",
        });

    } catch (error) {
        next(error);
    };
};

export const uploadConfirmationMailTemplate = async ( req , res , next ) => {
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

        const templatePath = path.join(process.cwd(), "mailTemplates", "confirmationMail.json");

        fs.writeFileSync(templatePath, JSON.stringify(jsonTemplate));

        return res.status(200).json({
            status: "success",
            message: "Mail format uploaded successfully.",
        });

    } catch (error) {
        next(error);
    };
};

export const sendMailToApplicantTeam = async ( req , res , next ) => {
    try {

        const { id } = req.params;

        const applicant = await teamRegistrationModel
            .findById(id)
            .select("teamLeader.email")
            .populate("event")
            .exec();
        
        if (!applicant) {
            return res.status(400).json({
                status: "error",
                message: "Applicant not found.",
            });
        };

        if(!applicant.event.isOpen) {
            return res.status(400).json({
                status: "error",
                message: "Event is closed.",
            });
        };

        const templatePath = path.join(process.cwd(), "mailTemplates", "confirmationMail.json");
        const templateData = fs.readFileSync(templatePath, "utf-8");
        const { subject , html } = JSON.parse(templateData);

        
        const mailOptions = {
            from: `Notification <${process.env.EMAIL_USER}>`,
            to: applicant.teamLeader.email,
            subject,
            html,
        };

        const isSent = await sendMail(mailOptions);

        if(!isSent) {
            return res.status(400).json({
                status: "error",
                message: "Error in sending mails.",
            });
        };

        
        applicant.isSelected = true;
        await applicant.save();

        return res.status(200).json({
            status: "success",
            message: "Mail sent successfully.",
            data: applicant,
        });

    } catch (error) {
        next();
    };
};

export const getAllSoloParticipants = async ( req , res , next ) => {
    try {

        const allParticipants = await soloRegistrationModel.find({
            event: req.params.eventId,
        });

        return res.status(200).json({
            status: "success",
            message: "All participants fetched successfully.",
            data: allParticipants,
        });

    } catch (error) {
        next(error);
    };
};

export const deleteSoloApplicant = async ( req , res , next ) => {
    try {

        const { regId } = req.params;

        const applicant = await soloRegistrationModel.findById(regId);

        if (!applicant) {
            return res.status(400).json({
                status: "error",
                message: "Applicant not found.",
            });
        };

        await applicant.deleteOne();

        return res.status(200).json({
            status: "success",
            message: "Applicant deleted successfully.",
        });

    } catch (error) {
        next(error);
    };
};

export const sendMailToApplicantSolo = async ( req , res , next ) => {
    try {
        
        const { id } = req.params;

        const applicant = await soloRegistrationModel
            .findById(id)
            .select("email")
            .populate("event")
            .exec();

        if (!applicant) {
            return res.status(400).json({
                status: "error",
                message: "Applicant not found.",
            });
        }

        if(!applicant.event.isOpen) {
            return res.status(400).json({
                status: "error",
                message: "Event is closed.",
            });
        };
        
        const templatePath = path.join(process.cwd(), "mailTemplates", "confirmationMail.json");
        const templateData = fs.readFileSync(templatePath, "utf-8");
        const { subject , html } = JSON.parse(templateData);


        const mailOptions = {
            from: `Congratulations <${process.env.EMAIL_USER}>`,
            to: applicant.email,
            subject,
            html,
        };

        // isSelected must be true
        
        applicant.isSelected = true;
        await applicant.save();


        const isSent = await sendMail(mailOptions);

        if(!isSent) {
            return res.status(400).json({
                status: "error",
                message: "Error in sending mails.",
            });
        };

        return res.status(200).json({
            status: "success",
            message: "Mail sent successfully.",
            data: applicant,
        });
    } catch (error) {
        next(error);
    };
};

export const uploadImageToEvent = async ( req , res , next ) => {
    try {

        const { id } = req.params;

        const event = await events.findById(id);

        if (!event) {
            return res.status(400).json({
                status: "error",
                message: "Event not found.",
            });
        };

        if(!req.files) {
            return res.status(400).json({
                status: "error",
                message: "Image is required.",
            });
        };
        
        const images = req.files.image.map((file) => `/files/images/${file.filename}`);

        const updateEvent = await events.findByIdAndUpdate(id, {
            images: [...event.images, ...images],
        }, {
            new: true,
        });

        const domain = process.env.DOMAIN;

        return res.status(200).json({
            status: "success",
            message: "Image uploaded successfully.",
            eventId: id,
            urls: images.map((image) => `${domain}${image}`),
        });

    } catch (error) {
        next(error);
    };
};