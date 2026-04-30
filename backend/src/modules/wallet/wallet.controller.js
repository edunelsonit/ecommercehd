const prisma = require('../../config/db');

exports.getBalance = async (req, res, next) => {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { userId: BigInt(req.user.id) },
            include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
        });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.json(wallet);
    } catch (error) {
        next(error);
    }
};

exports.fundWallet = async (req, res, next) => {
    try {
        const { amount, reference } = req.body;
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero' });
        }

        const result = await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.update({
                where: { userId: BigInt(req.user.id) },
                data: { balance: { increment: numericAmount } }
            });

            const transaction = await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: numericAmount,
                    transactionType: 'funding',
                    status: 'success',
                    reference
                }
            });

            return { wallet, transaction };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};
