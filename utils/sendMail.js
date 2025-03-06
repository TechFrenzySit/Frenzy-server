import { transporter } from '../config/emailSetup.js';

export const sendMail = async (mailOptions) => {
    try {
        const a = await transporter.sendMail(mailOptions);
        return a;
        
    } catch (error) {
        return null;
    };
};