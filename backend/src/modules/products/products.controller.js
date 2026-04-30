const prisma = require('../../config/db');

const TEST_VENDOR_PHONE = '09000000000';

function requireAdmin(req, res) {
    if (!['admin', 'superadmin'].includes(req.user?.role)) {
        res.status(403).json({ message: 'Admin access required' });
        return false;
    }

    return true;
}

async function getOrCreateTestVendor() {
    const user = await prisma.user.upsert({
        where: { phone: TEST_VENDOR_PHONE },
        update: {
            role: 'vendor',
            city: 'Gembu',
            lga_region: 'Sardauna'
        },
        create: {
            surname: 'Test',
            first_name: 'Vendor',
            phone: TEST_VENDOR_PHONE,
            address: 'Elvekas test marketplace',
            lga_region: 'Sardauna',
            city: 'Gembu',
            password_hash: 'temporary-test-account',
            role: 'vendor',
            wallet: {
                create: {}
            }
        }
    });

    return prisma.vendor.upsert({
        where: { userId: user.id },
        update: {
            businessName: 'Elvekas Test Vendor',
            vendorType: 'testing'
        },
        create: {
            userId: user.id,
            businessName: 'Elvekas Test Vendor',
            vendorType: 'testing',
            isVerified: true
        }
    });
}

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

exports.createTemporaryProduct = async (req, res, next) => {
    if (!requireAdmin(req, res)) return;

    try {
        const {
            name,
            description,
            basePrice,
            unitType,
            stockQuantity,
            size,
            color,
            sku
        } = req.body;

        const numericPrice = Number(basePrice);
        const numericStock = Number(stockQuantity || 10);

        if (!name || !Number.isFinite(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: 'Product name and valid basePrice are required' });
        }

        const vendor = await getOrCreateTestVendor();
        const product = await prisma.product.create({
            data: {
                vendorId: vendor.id,
                name,
                description: description || '[TEST] Temporary marketplace product',
                basePrice: numericPrice,
                unitType: unitType || 'piece',
                isAvailable: true,
                variants: {
                    create: {
                        size: size || null,
                        color: color || null,
                        stockQuantity: Number.isFinite(numericStock) ? numericStock : 10,
                        sku: sku || `TEST-${Date.now()}`
                    }
                }
            },
            include: {
                variants: true,
                vendor: {
                    select: {
                        businessName: true,
                        user: { select: { city: true } }
                    }
                }
            }
        });

        res.status(201).json({
            ...product,
            vendor: {
                businessName: product.vendor.businessName,
                city: product.vendor.user?.city || null
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all products with filters for Gembu city and price range
exports.getProducts = async (req, res, next) => {
    const { city, minPrice, maxPrice } = req.query;

    try {
        const products = await prisma.product.findMany({
            where: {
                isAvailable: true,
                vendor: {
                    is: {
                        user: {
                            is: {
                                role: 'vendor',
                                city: city || undefined
                            }
                        }
                    }
                },
                basePrice: {
                    gte: minPrice ? parseFloat(minPrice) : undefined,
                    lte: maxPrice ? parseFloat(maxPrice) : undefined
                }
            },
            include: { 
                variants: true,
                vendor: {
                    select: {
                        businessName: true,
                        user: {
                            select: {
                                city: true
                            }
                        }
                    }
                }
            }
        });

        res.json(products.map((product) => ({
            ...product,
            vendor: product.vendor ? {
                businessName: product.vendor.businessName,
                city: product.vendor.user?.city || null
            } : null
        })));
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
