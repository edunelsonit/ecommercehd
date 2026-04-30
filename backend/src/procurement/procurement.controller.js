const prisma = require('../config/db');

exports.requestProcurement = async (req, res, next) => {
    try {
        const { productUrl, estimatedCost } = req.body;
        const numericEstimatedCost = Number(estimatedCost);

        if (!productUrl || !Number.isFinite(numericEstimatedCost) || numericEstimatedCost <= 0) {
            return res.status(400).json({ message: 'A valid productUrl and estimatedCost are required' });
        }
        
        // Pricing Logic: Exchange Rate (e.g., 1600) + Fees
        const exchangeRate = 1600; 
        const shippingFee = 5000; // Flat rate to Gembu
        const serviceFee = numericEstimatedCost * 0.10; // 10% Elvekas fee
        
        const finalTotal = (numericEstimatedCost * exchangeRate) + shippingFee + serviceFee;

        const request = await prisma.externalProcurement.create({
            data: {
                userId: BigInt(req.user.id),
                productUrl,
                estimatedCost: numericEstimatedCost,
                shippingCustomsFee: shippingFee,
                serviceFee,
                finalTotal,
                status: 'evaluating'
            }
        });
        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};
