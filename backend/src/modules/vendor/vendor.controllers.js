const prisma = require('../../config/db');

const getVendorProfile = async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      include: { _count: { select: { products: true } } }
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, vendor, products });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });

    const product = await prisma.product.create({
      data: {
        ...req.body,
        vendorId: vendor.id,
        basePrice: parseFloat(req.body.basePrice)
      }
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVendorProfile, createProduct };