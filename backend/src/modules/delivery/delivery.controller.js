const prisma = require('../../config/db');

// In-memory store for tracking (Since Redis is optional)
// In production with multiple server instances, use Redis.
global.liveLocations = global.liveLocations || {};

exports.updateDeliveryStatus = async (req, res, next) => {
    try {
        const { deliveryId, status } = req.body;
        const riderId = req.user.id;

        // Verify the rider owns this delivery
        const delivery = await prisma.delivery.findUnique({
            where: { id: parseInt(deliveryId) }
        });

        if (!delivery || delivery.riderId !== riderId) {
            return res.status(403).json({ message: "Unauthorized: This is not your delivery." });
        }

        const updatedDelivery = await prisma.delivery.update({
            where: { id: parseInt(deliveryId) },
            data: { 
                status, // e.g., 'picked_up', 'in_transit'
                updatedAt: new Date()
            }
        });

        // Sync Order status with Delivery status
        let orderStatus = 'processing';
        if (status === 'picked_up') orderStatus = 'shipped';
        
        await prisma.order.update({
            where: { id: delivery.orderId },
            data: { orderStatus }
        });

        res.json(updatedDelivery);
    } catch (error) {
        next(error);
    }
};

exports.getTracking = async (req, res) => {
    const { orderId } = req.params;
    const location = global.liveLocations[orderId];

    if (!location) {
        return res.status(404).json({ message: "No active tracking data available." });
    }

    res.json(location);
};

exports.completeDelivery = async (req, res, next) => {
    try {
        const { orderId, otp } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { delivery: true }
        });

        if (!order || order.otpCode !== otp) {
            return res.status(400).json({ message: "Invalid Delivery OTP." });
        }

        const result = await prisma.$transaction([
            // 1. Update Order
            prisma.order.update({
                where: { id: order.id },
                data: { orderStatus: 'delivered' }
            }),
            // 2. Update Delivery
            prisma.delivery.update({
                where: { id: order.delivery.id },
                data: { 
                    status: 'delivered',
                    deliveredAt: new Date()
                }
            })
        ]);

        // Clean up memory tracking
        delete global.liveLocations[orderId];

        res.json({ message: "Delivery confirmed and completed.", result });
    } catch (error) {
        next(error);
    }
};