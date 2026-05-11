const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {

        console.log("Creating transporter...");

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },

            connectionTimeout: 10000, // IMPORTANT
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        console.log("Before sendMail");

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body
        });

        console.log("MAIL SENT:", info);

        return info;

    } catch (error) {

        console.log("MAIL ERROR:", error);

        throw error;
    }
};

module.exports = mailSender;