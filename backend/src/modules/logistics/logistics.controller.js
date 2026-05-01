const prisma = require('../config/db');

// Helper to calculate fees (Exported for utility)
exports.calculateDeliveryFee = (distanceKm, isRainySeason) => {
    const baseFee = 300;
    const perKm = 100;
    let total = baseFee + (distanceKm * perKm);

    if (isRainySeason) {
        total *= 1.5; // 50% increase for difficult roads (e.g. Mambilla Plateau)
    }
    return total;
};

exports.assignRider = async (req, res, next) => {
    try {
        const { orderId, riderId, calculatedFee } = req.body;

        const delivery = await prisma.$transaction(async (tx) => {
            // Updated: Removed BigInt, using parseInt for Int compatibility
            const createdDelivery = await tx.delivery.create({
                data: {
                    orderId: parseInt(orderId),
                    riderId: parseInt(riderId),
                    deliveryFee: parseFloat(calculatedFee),
                    status: 'assigned'
                }
            });

            await tx.order.update({
                where: { id: parseInt(orderId) },
                data: { orderStatus: 'processing' }
            });

            return createdDelivery;
        });

        res.json(delivery);
    } catch (error) {
        next(error);
    }
};