const nodemailer = require("nodemailer");

// create transporter once
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Gmail App Password
    },
});

const mailSender = async (email, title, body) => {
    try {
        console.log("Sent")
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