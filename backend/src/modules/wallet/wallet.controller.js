const prisma = require('../../config/db');

exports.getBalance = async (req, res, next) => {
    try {
        // req.user.id is now a standard Number
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.id },
            include: { 
                transactions: { 
                    orderBy: { createdAt: 'desc' }, 
                    take: 15 // Increased slightly for better history view
                } 
            }
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
        const numericAmount = parseFloat(amount);

        if (!numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'A valid amount greater than zero is required' });
        }

        // prisma.$transaction ensures both steps succeed or both fail
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update the balance
            const wallet = await tx.wallet.update({
                where: { userId: req.user.id },
                data: { balance: { increment: numericAmount } }
            });

            // 2. Create the ledger entry
            const transaction = await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: numericAmount,
                    transactionType: 'funding',
                    status: 'success',
                    reference: reference || `REF-${Date.now()}`
                }
            });

            return { 
                newBalance: wallet.balance, 
                transactionId: transaction.id,
                reference: transaction.reference 
            };
        });

        res.json({ message: 'Wallet funded successfully', data: result });
    } catch (error) {
        // Handle unique constraint error for references (Paystack/Flutterwave duplicates)
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Duplicate transaction reference' });
        }
        next(error);
    }
};