exports.generateOTP = () => {
    // Generates a 6-digit code for Proof of Delivery
    return Math.floor(100000 + Math.random() * 900000).toString();
};