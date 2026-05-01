const axios = require('axios');

const verifyPaystack = async (reference) => {
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });
        
        // Paystack returns data.status === 'success' for successful charges
        return response.data.status === true && response.data.data.status === 'success';
    } catch (error) {
        console.error('Paystack verification error:', error.response?.data || error.message);
        return false;
    }
};

module.exports = { verifyPaystack };