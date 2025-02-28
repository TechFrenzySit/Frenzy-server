import registrationModel from "../models/registrationModel.js";
import { registrationSchema } from "../utils/zodSchema.js"

export const registration = async ( req , res , next ) => {
    try {

        const validatedData = registrationSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                status: "error",
                message: process.env.NODE_ENV === "development" ? validatedData.error.errors : "Invalid data",
            });
        };

        const teamNameExists = await registrationModel.findOne({ teamName: validatedData.data.teamName });

        if (teamNameExists) {
            return res.status(400).json({
                status: "error",
                message: "Team name already exists, choose another name.",
            });
        };

        const registration = await registrationModel(validatedData.data);

        await registration.save();

        // send mail to team leader and core team

        return res.status(200).json({
            status: "success",
            message: "Registration is successful."
        });

    } catch (error) {
        next(error);
    };
};