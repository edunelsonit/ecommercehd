const express = require('express');
const router = express.Router();
const procurementController = require('./procurement.controller');
const {protect} = require('../../middlewares/auth.middleware');

// User creates a new "Buy for Me" request
router.post('/request', protect, procurementController.requestProcurement);

// User views their own requests
router.get('/my-requests', protect, async (req, res, next) => {
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