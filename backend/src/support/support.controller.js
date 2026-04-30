const prisma = require('../config/db');

exports.fileDispute = async (req, res, next) => {
    try {
        const { orderId, reason } = req.body;

        const dispute = await prisma.$transaction(async (tx) => {
            const createdDispute = await tx.dispute.create({
                data: {
                    orderId: BigInt(orderId),
                    userId: BigInt(req.user.id),
                    reason,
                    status: 'open'
                }
            });

            await tx.order.update({
                where: { id: BigInt(orderId) },
                data: { orderStatus: 'cancelled' }
            });

            return createdDispute;
        });

        res.status(201).json(dispute);
    } catch (error) {
        next(error);
    }
};
