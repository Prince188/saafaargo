const nodemailer = require("nodemailer");
const dns = require("dns");

const mailSender = async (email, title, body) => {
    try {

        // FORCE IPV4
        dns.setDefaultResultOrder("ipv4first");

        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },

            family: 4,

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

        console.log("MAIL SENT:", info);

        return info;

    } catch (error) {

        console.log("MAIL ERROR:", error);

        throw error;
    }
};

module.exports = mailSender;