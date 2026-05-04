const prisma = require("../../config/db");

// Helper to get total overview
const getOverview = async (req, res, next) => {
    try {
        const [totalUsers, totalVendors, totalProducts, activeOrdersCount, pendingProcurementsCount] = await Promise.all([
            prisma.user.count(),
            prisma.vendor.count(),
            prisma.product.count(),
            prisma.order.count({ where: { orderStatus: { not: 'delivered' } } }),
            prisma.externalProcurement.count({ where: { status: 'evaluating' } })
        ]);

        const revenueAgg = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { paymentStatus: 'paid' }
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                totalVendors,
                totalProducts,
                activeOrders: activeOrdersCount,
                pendingProcurements: pendingProcurementsCount,
                totalRevenue: revenueAgg._sum.totalAmount || 0
            }
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
            disputeCount
        ] = await Promise.all([
            prisma.user.count(),
            prisma.order.count({
                where: { orderStatus: { in: ['pending', 'processing'] } }
            }),
            prisma.walletTransaction.aggregate({
                _sum: { amount: true },
                where: { 
                    status: 'success',
                    transactionType: 'order_payment'
                }
            }),
            prisma.externalProcurement.groupBy({
                by: ['status'],
                _count: { _all: true }
            }),
            prisma.dispute.count({
                where: { status: 'open' }
            })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers: userCount,
                activeOrders: orderStats,
                totalRevenue: revenueStats._sum.amount || 0,
                openDisputes: disputeCount,
                procurementPipeline: procurementStats.map(p => ({
                    status: p.status,
                    count: p._count._all
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

const getRecentOrders = async (req, res, next) => {
    try {
        const recent = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { 
                user: {
                    select: { firstName: true, surname: true, email: true }
                } 
            }
        });
        res.json({ success: true, data: recent });
    } catch (error) { 
        next(error); 
    }
};

// EXPORT ALL AT ONCE (This prevents the "not a function" error)
module.exports = { 
    getOverview, 
    getDashboardStats, 
    getRecentOrders 
};