const prisma = require('../../config/db');

// Helper to get or create a cart for a user or session
const getOrCreateCart = async (userId, sessionId) => {
    if (userId) {
        return await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId }
        });
    }
    return await prisma.cart.upsert({
        where: { sessionId },
        update: {},
        create: { sessionId }
    });
};

exports.getCart = async (req, res, next) => {
    try {
        const { sessionId } = req.query;
        const userId = req.user?.id;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: 'User ID or Session ID required' });
        }

        const cart = await prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                basePrice: true,
                                image: true,
                                unitType: true
                            }
                        }
                    }
                }
            }
        });

        res.json(cart || { items: [] });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, sessionId } = req.body;
        const userId = req.user?.id;

        const cart = await getOrCreateCart(userId, sessionId);

        const cartItem = await prisma.cartItem.upsert({
            where: {
                // We use a unique constraint or find manually if not compound
                id: (await prisma.cartItem.findFirst({
                    where: { cartId: cart.id, productId: parseInt(productId) }
                }))?.id || -1
            },
            update: {
                quantity: { increment: parseInt(quantity) || 1 }
            },
            create: {
                cartId: cart.id,
                productId: parseInt(productId),
                quantity: parseInt(quantity) || 1
            }
        });

        res.status(201).json(cartItem);
    } catch (error) {
        next(error);
    }
};

exports.updateQuantity = async (req, res, next) => {
    try {
        const { cartItemId, quantity } = req.body;

        if (quantity <= 0) {
            await prisma.cartItem.delete({ where: { id: parseInt(cartItemId) } });
            return res.json({ message: 'Item removed from cart' });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: parseInt(cartItemId) },
            data: { quantity: parseInt(quantity) }
        });

        res.json(updatedItem);
    } catch (error) {
        next(error);
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        await prisma.cartItem.delete({
            where: { id: parseInt(cartItemId) }
        });
        res.json({ message: 'Item removed' });
    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user?.id;

        const cart = await prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId }
        });

        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};