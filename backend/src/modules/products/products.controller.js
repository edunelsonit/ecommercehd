const prisma = require('../../config/db');

// Create a new product with optional variants
exports.createProduct = async (req, res, next) => {
    try {
        const { vendorId, name, description, basePrice, unitType, variants } = req.body;

        const product = await prisma.product.create({
            data: {
                vendorId: BigInt(vendorId),
                name,
                description,
                basePrice,
                unitType: unitType || 'piece',
                // Batch create variants if provided (e.g., for fashion)
                variants: variants ? {
                    create: variants.map(v => ({
                        size: v.size,
                        color: v.color,
                        priceOverride: v.priceOverride,
                        stockQuantity: v.stockQuantity,
                        sku: v.sku
                    }))
                } : undefined
            },
            include: { variants: true }
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// Get all products with filters for Gembu city and category
exports.getProducts = async (req, res, next) => {
    const { category, city, minPrice, maxPrice } = req.query;

    try {
        const products = await prisma.product.findMany({
            where: {
                isAvailable: true,
                vendor: {
                    city: city || undefined, // Localized filtering
                    user: { role: 'vendor' }
                },
                basePrice: {
                    gte: minPrice ? parseFloat(minPrice) : undefined,
                    lte: maxPrice ? parseFloat(maxPrice) : undefined
                }
            },
            include: { 
                variants: true,
                vendor: { select: { businessName: true, city: true } }
            }
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// Update stock (Critical for inventory threshold alerts)
exports.updateStock = async (req, res, next) => {
    const { variantId, quantity } = req.body;

    try {
        const updatedVariant = await prisma.productVariant.update({
            where: { id: BigInt(variantId) },
            data: { stockQuantity: quantity }
        });

        // Check for threshold alerts
        const product = await prisma.product.findFirst({
            where: { variants: { some: { id: BigInt(variantId) } } }
        });

        if (product && quantity <= product.stockThreshold) {
            // Trigger WhatsApp/SMS alert via Notification Service
            console.log(`Alert: Low stock for ${product.name}`);
        }

        res.json(updatedVariant);
    } catch (error) {
        next(error);
    }
};
