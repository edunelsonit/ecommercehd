const prisma = require("../../config/db");

// Helper to get total overview
const getOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      activeOrdersCount,
      pendingProcurementsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.product.count(),
      prisma.order.count({ where: { orderStatus: { not: "delivered" } } }),
      prisma.externalProcurement.count({ where: { status: "evaluating" } }),
    ]);

    const revenueAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "paid" },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalProducts,
        activeOrders: activeOrdersCount,
        pendingProcurements: pendingProcurementsCount,
        totalRevenue: revenueAgg._sum.totalAmount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Main Stats call (The one your frontend is currently calling)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      userCount,
      orderStats,
      revenueStats,
      procurementStats,
      disputeCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count({
        where: { orderStatus: { in: ["pending", "processing"] } },
      }),
      prisma.walletTransaction.aggregate({
        _sum: { amount: true },
        where: {
          status: "success",
          transactionType: "order_payment",
        },
      }),
      prisma.externalProcurement.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.dispute.count({
        where: { status: "open" },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        activeOrders: orderStats,
        totalRevenue: revenueStats._sum.amount || 0,
        openDisputes: disputeCount,
        procurementPipeline: procurementStats.map((p) => ({
          status: p.status,
          count: p._count._all,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRecentOrders = async (req, res, next) => {
  try {
    const recent = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstName: true, surname: true, email: true },
        },
      },
    });
    res.json({ success: true, data: recent });
  } catch (error) {
    next(error);
  }
};

const addVendor = async (req, res, next) => {
  try {
    const {
      userId,
      businessName,
      vendorType,
      email,
      phone,
      category,
      address,
      isCacRegistered,
      cacNumber,
    } = req.body;

    // 1. Check if user exists and is not already a vendor
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingVendor = await prisma.vendor.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "This user is already registered as a vendor",
      });
    }

    // 2. Create the Vendor record
    const newVendor = await prisma.vendor.create({
      data: {
        userId: parseInt(userId),
        businessName,
        vendorType,
        email,
        phone,
        category,
        address,
        isCacRegistered: isCacRegistered === "true" || isCacRegistered === true,
        cacNumber: cacNumber ? parseInt(cacNumber) : null,
        status: "active",
        isVerified: false, // Admin manually verifies later
      },
    });

    res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      data: newVendor,
    });
  } catch (error) {
    next(error);
  }
};

const getEligibleUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        role: "customer",
        vendorProfile: null, // ✅ Matches the name in your schema
      },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getLogisticsData = async (req, res, next) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: {
        rider: { select: { firstName: true, surname: true } },
        order: { select: { landmarkAddress: true, orderStatus: true } },
      },
      orderBy: { assignedAt: "desc" },
    });
    res.json({ success: true, data: deliveries });
  } catch (error) {
    next(error);
  }
};

const getProcurements = async (req, res) => {
  const procurements = await prisma.externalProcurement.findMany({
    include: {
      user: { select: { firstName: true, surname: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: procurements });
};

const getFinancialOverview = async (req, res, next) => {
  try {
    // 1. Fetch recent transactions
    const transactions = await prisma.walletTransaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: { 
          include: { 
            user: { select: { firstName: true, surname: true } } 
          } 
        }
      }
    });

    // 2. Aggregate Totals using your specific Enum values
    const stats = await prisma.walletTransaction.groupBy({
      by: ['transactionType'], // Matches your schema exactly
      _sum: { amount: true },
      where: { status: "SUCCESS" } // Ensure your DB uses uppercase 'SUCCESS' or lowercase 'success'
    });

    // 3. Map aggregates to your frontend summary
    // We map 'funding' to inflow and 'withdrawal' to outflow
    const summary = {
      totalBalance: 0, 
      totalInflow: stats.find(s => s.transactionType === 'funding')?._sum.amount || 0,
      totalOutflow: stats.find(s => s.transactionType === 'withdrawal')?._sum.amount || 0,
    };

    res.json({ success: true, transactions, summary });
  } catch (error) {
    next(error);
  }
};

const getDisputes = async (req, res, next) => {
  try {
    const disputes = await prisma.dispute.findMany({
      include: {
        user: { select: { firstName: true, surname: true, email: true } },
        order: { select: { totalAmount: true, orderStatus: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: disputes });
  } catch (error) {
    next(error);
  }
};

// EXPORT ALL AT ONCE (This prevents the "not a function" error)
module.exports = {
  getOverview,
  getDashboardStats,
  getRecentOrders,
  getFinancialOverview,
  getLogisticsData,
  addVendor,
  getEligibleUsers,
  getProcurements,
  getDisputes
};
