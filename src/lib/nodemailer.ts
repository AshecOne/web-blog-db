import nodemailer from "nodemailer";

export const trasnporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_APP_PASSWORD,
    }
})