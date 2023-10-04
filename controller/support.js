
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");
const Support = require("../models/support")
const Faqs = require("../models/faqsAndContent")

const utils = new Utils();
const auth = new Auth();


const submitMessage = async (req, res) => {
    try {
        const { email, message } = req.body;

        if (!email || !message) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const support = await Support.create({
            email: email,
            message: message,
        });

        return res.status(201).json({ message: 'Message submitted', data: support });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to submit Message', message: error.message });
    }
};

const faqsAndContent = async (req, res) => {
    try {
        const { title, owner, content } = req.body;

        if (!title || !owner, content) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const faqs = await Faqs.create({
            title:title ,
            owner: owner,
            content:content
        });

        return res.status(201).json({ message: 'Message submitted', data: faqs });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to submit Message', message: error.message });
    }
};


module.exports = {
    submitMessage,
    faqsAndContent
}