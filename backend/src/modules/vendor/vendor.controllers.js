import prisma from "../../config/db.js";

export const getVendorProfile = async (req, res, next) => {
  try {
    // 1. Get the vendor profile linked to the logged-in user
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      include: {
        _count: { select: { products: true } }
      }
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor profile not found" });
    }

    // 2. Get all products belonging to this vendor
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

export const createProduct = async (req, res, next) => {
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