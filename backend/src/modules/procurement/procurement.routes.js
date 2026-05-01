const express = require('express');
const router = express.Router();
const procurementController = require('./procurement.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// User creates a new "Buy for Me" request
router.post('/request', verifyToken, procurementController.requestProcurement);

// User views their own requests
router.get('/my-requests', verifyToken, async (req, res, next) => {
    try {
        const requests = await prisma.externalProcurement.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        next(error);
    }
});

module.exports = router;