const prisma = require('../../config/db');

/**
 * Calculates dynamic pricing for Gembu's unique terrain and weather
 */
exports.calculateDynamicPrice = (basePrice, isRainy, distance) => {
    let multiplier = 1.0;
    if (isRainy) multiplier += 0.5; // 50% Surcharge for rainy season on Mambilla Plateau
    if (distance > 10) multiplier += 0.2; // 20% distance surcharge
    return basePrice * multiplier;
};

exports.requestProcurement = async (req, res, next) => {
    try {
        const { productUrl, estimatedCost } = req.body;
        const numericEstimatedCost = parseFloat(estimatedCost);

        if (!productUrl || !numericEstimatedCost || numericEstimatedCost <= 0) {
            return res.status(400).json({ message: 'A valid productUrl and estimatedCost are required' });
        }
        
        // Pricing Logic
        const exchangeRate = 1600; 
        const shippingFee = 5000; // Flat rate for logistics to Gembu
        const serviceFee = (numericEstimatedCost * exchangeRate) * 0.10; // 10% Elvekas service fee
        
        const finalTotal = (numericEstimatedCost * exchangeRate) + shippingFee + serviceFee;

        const request = await prisma.externalProcurement.create({
            data: {
                userId: req.user.id, // req.user.id is already an Int from our updated middleware
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

/**
 * Admin utility to update procurement status (e.g., when item is purchased or arrived)
 */
exports.updateProcurementStatus = async (req, res, next) => {
    try {
        const { id, status, shippingCustomsFee } = req.body;
        
        const updated = await prisma.externalProcurement.update({
            where: { id: parseInt(id) },
            data: { 
                status,
                shippingCustomsFee: shippingCustomsFee ? parseFloat(shippingCustomsFee) : undefined
            }
        });
        
        res.json(updated);
    } catch (error) {
        next(error);
    }
};