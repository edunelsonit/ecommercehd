const axios = require('axios');

const sendSMS = async (to, message) => {
    return await axios.post('https://api.termii.com/api/sms/send', {
        to,
        from: "Elvekas",
        sms: message,
        api_key: process.env.TERMII_API_KEY
    });
};

const sendWhatsApp = async (to, message) => {
    // Integration with Meta Cloud API
};

module.exports = { sendSMS, sendWhatsApp };