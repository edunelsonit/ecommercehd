const prisma = require('../config/db');

exports.fileDispute = async (req, res, next) => {
    try {
        const { orderId, reason } = req.body;

        const dispute = await prisma.$transaction(async (tx) => {
            const createdDispute = await tx.dispute.create({
                data: {
                    orderId: parseInt(orderId),
                    userId: req.user.id, // req.user.id is already an Int from middleware
                    reason,
                    status: 'open'
                }
            });

            // Automatically set order to cancelled or 'disputed' status
            await tx.order.update({
                where: { id: parseInt(orderId) },
                data: { orderStatus: 'cancelled' } // Or 'disputed' if you added that to Enum
            });

            return createdDispute;
        });

        res.status(201).json(dispute);
    } catch (error) {
        next(error);
    }
};

exports.formatAddress = (city, lgaName, landmark) => {
    return `${landmark}, ${city}, ${lgaName} LGA, Taraba State, Nigeria`;
};