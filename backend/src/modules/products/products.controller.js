const prisma = require('../../config/db');

const TEST_VENDOR_PHONE = '09000000000';
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80';

function normalizeKeywords(keywords) {
    if (Array.isArray(keywords)) {
        return keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
    }

    if (typeof keywords === 'string') {
        return keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean);
    }

    return [];
}

function normalizeRating(rating = {}, ratingStars, ratingCount) {
    const stars = Number(rating.stars ?? ratingStars ?? 0);
    const count = Number(rating.count ?? ratingCount ?? 0);

    return {
        ratingStars: Number.isFinite(stars) ? Math.max(0, Math.min(5, stars)) : 0,
        ratingCount: Number.isFinite(count) ? Math.max(0, count) : 0
    };
}

function serializeProduct(product) {
    const { ratingStars, ratingCount, ...rest } = product;

    return {
        ...rest,
        rating: {
            stars: ratingStars,
            count: ratingCount
        },
        vendor: product.vendor ? {
            businessName: product.vendor.businessName,
            city: product.vendor.user?.city || product.vendor.city || null
        } : null
    };
}

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
        const {
            vendorId,
            name,
            description,
            image,
            rating,
            ratingStars,
            ratingCount,
            keywords,
            basePrice,
            unitType,
            variants
        } = req.body;
        const normalizedRating = normalizeRating(rating, ratingStars, ratingCount);

        const vendor = vendorId
            ? await prisma.vendor.findUnique({ where: { id: BigInt(vendorId) } })
            : await prisma.vendor.findUnique({ where: { userId: BigInt(req.user.id) } });

        if (!vendor) {
            return res.status(400).json({ message: 'Create a vendor profile before adding products' });
        }

        if (
            vendor.userId !== BigInt(req.user.id) &&
            !['admin', 'superadmin'].includes(req.user.role)
        ) {
            return res.status(403).json({ message: 'You cannot add products for this vendor' });
        }

        const product = await prisma.product.create({
            data: {
                vendorId: vendor.id,
                name,
                description,
                image: image || DEFAULT_PRODUCT_IMAGE,
                ...normalizedRating,
                keywords: normalizeKeywords(keywords),
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

        res.status(201).json(serializeProduct(product));
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
            image,
            rating,
            ratingStars,
            ratingCount,
            keywords,
            stockQuantity,
            size,
            color,
            sku
        } = req.body;

        const numericPrice = Number(basePrice);
        const numericStock = Number(stockQuantity || 10);
        const normalizedRating = normalizeRating(rating, ratingStars, ratingCount);

        if (!name || !Number.isFinite(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: 'Product name and valid basePrice are required' });
        }

        const vendor = await getOrCreateTestVendor();
        const product = await prisma.product.create({
            data: {
                vendorId: vendor.id,
                name,
                description: description || '[TEST] Temporary marketplace product',
                image: image || DEFAULT_PRODUCT_IMAGE,
                ...normalizedRating,
                keywords: normalizeKeywords(keywords),
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

        res.status(201).json(serializeProduct(product));
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

        res.json(products.map(serializeProduct));
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
