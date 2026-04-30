const axios = require('axios');

const verifyPaystack = async (reference) => {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });
    return response.data.status === 'success';
};

module.exports = { verifyPaystack };