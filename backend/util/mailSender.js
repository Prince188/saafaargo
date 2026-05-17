const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"SafarGO" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("MAIL SENT:", info.messageId);

        return info;

    } catch (error) {
        console.log("MAIL ERROR:", error);
        throw error;
    }
};

module.exports = mailSender;