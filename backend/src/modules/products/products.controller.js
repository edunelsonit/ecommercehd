const prisma = require('../../config/db');

const TEST_VENDOR_PHONE = '09000000000';
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80';

// Helper: Standardize keyword array
function normalizeKeywords(keywords) {
    if (Array.isArray(keywords)) return keywords.map(k => String(k).trim()).filter(Boolean);
    if (typeof keywords === 'string') return keywords.split(',').map(k => k.trim()).filter(Boolean);
    return [];
}

// Helper: Ensure ratings fall within logical bounds
function normalizeRating(rating = {}, ratingStars, ratingCount) {
    const stars = Number(rating.stars ?? ratingStars ?? 0);
    const count = Number(rating.count ?? ratingCount ?? 0);
    return {
        ratingStars: Number.isFinite(stars) ? Math.max(0, Math.min(5, stars)) : 0,
        ratingCount: Number.isFinite(count) ? Math.max(0, count) : 0
    };
}

// Helper: Format output for the frontend
function serializeProduct(product) {
    const { ratingStars, ratingCount, ...rest } = product;
    return {
        ...rest,
        rating: { stars: ratingStars, count: ratingCount },
        vendor: product.vendor ? {
            businessName: product.vendor.businessName,
            city: product.vendor.user?.city || null
        } : null
    };
}

// Helper: Ensure the user is a Test Vendor for the "Temporary" flow
async function getOrCreateTestVendor() {
    // Standardized to match new schema fields
    const user = await prisma.user.upsert({
        where: { phone: TEST_VENDOR_PHONE },
        update: { role: 'vendor', city: 'Gembu' },
        create: {
            surname: 'Test',
            firstName: 'Vendor', // Updated
            phone: TEST_VENDOR_PHONE,
            address: 'Elvekas test marketplace',
            city: 'Gembu',
            genderId: 1, // Assumption: 1 is 'Male' or 'Other' in your Genders table
            passwordHash: 'temporary-test-account', // Updated
            role: 'vendor',
            wallet: { create: {} }
        }
    });

    return prisma.vendor.upsert({
        where: { userId: user.id },
        update: { businessName: 'Elvekas Test Vendor' },
        create: {
            userId: user.id,
            businessName: 'Elvekas Test Vendor',
            vendorType: 'testing',
            isVerified: true
        }
    });
}

exports.createProduct = async (req, res, next) => {
    try {
        const {
            vendorId,
            categoryId, // Now required by schema
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

        // Int-based lookup (no BigInt needed)
        const vendor = vendorId
            ? await prisma.vendor.findUnique({ where: { id: parseInt(vendorId) } })
            : await prisma.vendor.findUnique({ where: { userId: req.user.id } });

        if (!vendor) return res.status(400).json({ message: 'Vendor profile not found' });

        const product = await prisma.product.create({
            data: {
                vendorId: vendor.id,
                categoryId: parseInt(categoryId), // Link to your Category model
                name,
                description,
                image: image || DEFAULT_PRODUCT_IMAGE,
                ...normalizedRating,
                keywords: normalizeKeywords(keywords),
                basePrice: parseFloat(basePrice),
                unitType: unitType || 'piece',
                variants: variants ? {
                    create: variants.map(v => ({
                        size: v.size,
                        color: v.color,
                        priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
                        stockQuantity: parseInt(v.stockQuantity) || 0,
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

exports.getProducts = async (req, res, next) => {
    const { city, minPrice, maxPrice, categoryId } = req.query;

    try {
        const products = await prisma.product.findMany({
            where: {
                isAvailable: true,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                vendor: {
                    user: {
                        city: city || undefined
                    }
                },
                basePrice: {
                    gte: minPrice ? parseFloat(minPrice) : undefined,
                    lte: maxPrice ? parseFloat(maxPrice) : undefined
                }
            },
            include: { 
                variants: true,
                category: true,
                vendor: {
                    select: {
                        businessName: true,
                        user: { select: { city: true } }
                    }
                }
            }
        });

        res.json(products.map(serializeProduct));
    } catch (error) {
        next(error);
    }
};

exports.updateStock = async (req, res, next) => {
    const { variantId, quantity } = req.body;

    try {
        const updatedVariant = await prisma.productVariant.update({
            where: { id: parseInt(variantId) },
            data: { stockQuantity: parseInt(quantity) }
        });

        const product = await prisma.product.findFirst({
            where: { variants: { some: { id: parseInt(variantId) } } }
        });

        if (product && quantity <= product.stockThreshold) {
            console.log(`[LOW STOCK ALERT]: ${product.name}`);
        }

        res.json(updatedVariant);
    } catch (error) {
        next(error);
    }
};