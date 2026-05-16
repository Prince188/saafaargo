const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log("VERIFY ERROR:", error);
    } else {
        console.log("SMTP READY");
    }
});

const mailSender = async (email, title, body) => {
    try {

        console.log("NEW NODEMAILER CODE RUNNING");

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