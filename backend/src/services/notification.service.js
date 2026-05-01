const axios = require('axios');

const sendSMS = async (to, message) => {
    try {
        return await axios.post('https://api.termii.com/api/sms/send', {
            to,
            from: "Elvekas",
            sms: message,
            type: "plain",
            channel: "generic",
            api_key: process.env.TERMII_API_KEY
        });
    } catch (error) {
        console.error('Termii SMS failed:', error.response?.data || error.message);
    }
};

const sendWhatsApp = async (to, message) => {
    // Placeholder for Meta Cloud API integration
    // Requires: Business Account ID, Phone Number ID, and Permanent Access Token
    console.log(`WhatsApp to ${to}: ${message}`);
};

module.exports = { sendSMS, sendWhatsApp };