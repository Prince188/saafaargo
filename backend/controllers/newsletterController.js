const Newsletter = require("../models/Newsletter");
const mailSender = require("../util/mailSender");

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await Newsletter.findOne({ email });

        if (user && user.subscribed) {
            return res.status(400).json({ message: "Already subscribed" });
        }

        if (!user) {
            user = await Newsletter.create({ email });
        } else {
            user.subscribed = true;
            await user.save();
        }

        await mailSender(
            email,
            "🎉 Subscribed Successfully - SafarGo",
            `
      <h2>Welcome to SafarGo 🚗</h2>
      <p>You are successfully subscribed!</p>
      `
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Newsletter.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        user.subscribed = false;
        await user.save();

        await mailSender(
            email,
            "😢 Unsubscribed - SafarGo",
            `
      <h2>You have unsubscribed</h2>
      <p>You will no longer receive updates.</p>
      `
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};