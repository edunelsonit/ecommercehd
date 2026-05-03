const prisma = require('../../config/db');

exports.getOverview = async (req, res, next) => {
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

        const totalRevenue = revenueAgg._sum.totalAmount || 0;

        res.json({
            totalUsers,
            totalVendors,
            totalProducts,
            activeOrders: activeOrdersCount,
            pendingProcurements: pendingProcurementsCount,
            totalRevenue: totalRevenue.toString()
        });
    } catch (error) {
        next(error);
    }
};

exports.getRecentOrders = async (req, res, next) => {
    try {
        const recent = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });
        res.json(recent);
    } catch (error) { next(error); }
};
const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            userCount,
            orderStats,
            revenueStats,
            procurementStats,
            disputeCount
        ] = await Promise.all([
            // 1. Total Users
            prisma.user.count(),

            // 2. Active Orders (Pending or Processing)
            prisma.order.count({
                where: {
                    orderStatus: { in: ['pending', 'processing'] }
                }
            }),

            // 3. Total Revenue (Sum of successful funding or order payments)
            prisma.walletTransaction.aggregate({
                _sum: { amount: true },
                where: { 
                    status: 'success',
                    transactionType: 'order_payment'
                }
            }),

            // 4. Procurement Pipeline (Grouped by status)
            prisma.externalProcurement.groupBy({
                by: ['status'],
                _count: { _all: true }
            }),

            // 5. Open Disputes
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

module.exports = { getDashboardStats };