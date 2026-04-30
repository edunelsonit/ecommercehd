const prisma = require('../config/db');

exports.assignRider = async (req, res, next) => {
    try {
        const { orderId, riderId, calculatedFee } = req.body;

        const delivery = await prisma.$transaction(async (tx) => {
            const createdDelivery = await tx.delivery.create({
                data: {
                    orderId: BigInt(orderId),
                    riderId: BigInt(riderId),
                    deliveryFee: Number(calculatedFee),
                    status: 'assigned'
                }
            });

            await tx.order.update({
                where: { id: BigInt(orderId) },
                data: { orderStatus: 'processing' }
            });

            return createdDelivery;
        });

        res.json(delivery);
    } catch (error) {
        next(error);
    }
};
