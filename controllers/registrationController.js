import teamRegistrationModel from "../models/teamRegistrationModel.js";
import mails from "../models/mails.js";
import events from "../models/events.js";

import { teamRegistrationSchema , emailSchema } from "../utils/zodSchema.js"

export const registrationTeam = async ( req , res , next ) => {
    try {

        const validatedData = teamRegistrationSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                status: "error",
                message: validatedData.error.errors,
            });
        };

        const eventId = validatedData.data.eventId;

        const eventExist = await events.findOne({
            _id: eventId,
            type: "team",
        });

        if (!eventExist) {
            return res.status(400).json({
                status: "error",
                message: "Event does not exist.",
            });
        };

        const currentDate = new Date();
        const checkStartingDate = new Date(eventExist.registrationDates.startingDate)
        const checkEndingDate = new Date(eventExist.registrationDates.endingDate)
        
        if(!eventExist.isOpen) {
            return res.status(400).json({
                status: "error",
                message: "Event is closed.",
            });
        };

        if (currentDate < checkStartingDate) {
            return res.status(400).json({
                status: "error",
                message: "Registration has not started yet.",
            });
        };

        if (currentDate > checkEndingDate) {
            return res.status(400).json({
                status: "error",
                message: "Registration is closed.",
            });
        };

        const teamNameExists1 = await teamRegistrationModel.find({
            "teamLeader.email": validatedData.data.teamLeader.email,
            event: eventId,
        });

        if (teamNameExists1.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "You have already registered the team.",
            });
        };

        const teamNameExists2 = await teamRegistrationModel.find({
            teamName: validatedData.data.teamName,
            event: eventId,
        });

        if (teamNameExists2.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "Team name already exists.",
            });
        };

        const registration = new teamRegistrationModel({...validatedData.data, event: eventId});

        await registration.save();
        
        const checkMail = await mails.exists({ email: validatedData.data.teamLeader.email });

        if(!checkMail) {
            const n = new mails({
                email: validatedData.data.teamLeader.email,
            });
            await n.save();
        };

        // send mail to team leader and core team

        return res.status(200).json({
            status: "success",
            message: "Registration is successful."
        });

    } catch (error) {
        next(error);
    };
};

export const newsLetter = async ( req , res , next ) => {
    try {
            
            const validatedData = emailSchema.safeParse(req.body);
            
            if(!validatedData.success) {
                return res.status(400).json({
                    status: "error",
                    message: validatedData.error.errors,
                });
            };

            const { email } = validatedData.data;
    
            const existingEmail = await mails.exists({ email });

            if (existingEmail) {
                return res.status(400).json({
                    status: "error",
                    message: "Already subscribed to news letter.",
                });
            };

            const newsLetter = new mails({
                email,
            })
            await newsLetter.save();
            
            return res.status(200).json({
                status: "success",
                message: "Subscribed to news letter successfully."
            });

    } catch (error) {
        next(error);
    };
};

export const registrationSolo = async ( req , res , next ) => {
    
};

export const getAllPastEvents = async ( req , res , next ) => {
    try {
        const currentDate = new Date();
        const pastEvents = await events.find();

        return res.status(200).json({
            status: "success",
            total: pastEvents.length,
            data: pastEvents,
        });
        
    } catch (error) {
        next();
    };
};