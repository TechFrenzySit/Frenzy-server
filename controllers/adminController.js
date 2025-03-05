import mails from "../models/mails.js";
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