const axios = require('axios');

exports.sendOTP = async (phone, otp) => {
    try {
        await axios.post('https://api.termii.com/api/sms/send', {
            to: phone,
            from: "Elvekas",
            sms: `Your Elvekas Delivery OTP is: ${otp}. Do not share until you see your package.`,
            type: "plain",
            api_key: process.env.TERMII_API_KEY
        });
    } catch (error) {
        console.error('SMS failed:', error.response?.data || error.message);
    }
};
