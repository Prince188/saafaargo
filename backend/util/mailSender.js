const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
    try {

        const response = await resend.emails.send({
            from: "SafarGO <onboarding@resend.dev>",
            to: email,
            subject: title,
            html: body,
        });

        console.log("MAIL SENT:", response);

        return response;

    } catch (error) {
        console.log("MAIL ERROR:", error);
        throw error;
    }
};

module.exports = mailSender;