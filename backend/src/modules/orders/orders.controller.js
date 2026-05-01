const prisma = require('../../config/db');
const { generateOTP } = require('../../utils/otp-generator');

exports.getOrders = async (req, res, next) => {
    try {
        // req.user.id is now a standard Number
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                delivery: true
            }
        });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, landmarkAddress } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalAmount: parseFloat(totalAmount),
                landmarkAddress,
                otpCode: generateOTP(), // Generates the delivery verification code
                items: {
                    create: items.map((item) => ({
                        productId: parseInt(item.productId),
                        variantId: item.variantId ? parseInt(item.variantId) : null,
                        quantity: item.quantity,
                        priceAtPurchase: parseFloat(item.price)
                    }))
                }
            },
            include: { items: true }
        });

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { orderId, otp } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
        });

        if (!order || order.otpCode !== otp) {
            return res.status(400).json({ message: 'Invalid delivery OTP' });
        }

        // Standardized to match the DeliveryStatus enum in your schema
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                orderStatus: 'delivered',
                delivery: {
                    update: {
                        status: 'delivered',
                        deliveredAt: new Date()
                    }
                }
            },
            include: { delivery: true }
        });

        res.json(updatedOrder);
    } catch (error) {
        next(error);
    }
};