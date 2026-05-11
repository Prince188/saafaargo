const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },

            family: 4, // FORCE IPV4

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body
        });

        console.log(info);

        return info;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = mailSender;