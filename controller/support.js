
const { Auth } = require("../middlewares/auth");
const { Utils } = require("../middlewares/utils");
const Support = require("../models/support")
const Faqs = require("../models/faqsAndContent")
const { User} = require("../models/users")

const utils = new Utils();
const auth = new Auth();


const submitMessage = async (req, res) => {
    try {
        const { email, message } = req.body;

        if (!email || !message) {
            return res.send({ statusCode:400, error: 'Required fields missing' });
        }
        const checkUserCode = await User.findOne({ where: { email: email } });

        const support = await Support.create({
            email: email,
            message: message,
        });

        return res.send({statusCode:201, message: 'Message submitted', data: support, senderCode:checkUserCode.user_code });
    } catch (error) {
        return res.send({ statusCode:500, error: 'Failed to submit Message', message: error.message });
    }
};

const faqsAndContent = async (req, res) => {
    try {
        const { title, owner, content } = req.body;

        if (!title || !owner, !content) {
            return res.send({ statusCode:400, error: 'Required fields missing' });
        }

        const faqs = await Faqs.create({
            title:title ,
            owner: owner,
            content:content
        });

        return res.send({statusCode:201, message: 'Message submitted', data: faqs });
    } catch (error) {
        console.log(error)
        return res.send({statusCode:500, error: 'Failed to submit Message', message: error.message });
    }
};

const getAllMessages = async (req, res) => {
    try {
        // Retrieve all submitted messages from the Support model
        const messages = await Support.findAll();

        return res.send({ statusCode:400, data: messages });
    } catch (error) {
        return res.send({ statusCode:500, error: 'Failed to retrieve messages', message: error.message });
    }
};

const getAllFaqsAndContent = async (req, res) => {
    try {
        // Retrieve all FAQs and content from the Faqs model
        const faqsAndContent = await Faqs.findAll();

        return res.send({ statusCode:200, data: faqsAndContent });
    } catch (error) {
        return res.send({ statusCode:500, error: 'Failed to retrieve FAQs and content', message: error.message });
    }
};

module.exports = {
    submitMessage,
    faqsAndContent,
    getAllMessages,
    getAllFaqsAndContent
}