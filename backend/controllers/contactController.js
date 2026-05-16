const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
    try {
        const { name, email, category, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            category,
            message,
        });

        res.status(201).json({
            success: true,
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit request",
        });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
        });
    }
};