import express from 'express';
import * as vendorCtrl from '../controllers/vendor/vendor.controller.js';
import { protect, vendorOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// All vendor routes require authentication and vendor role
router.use(protect);
router.use(vendorOnly);

router.get('/profile', vendorCtrl.getVendorProfile);
router.post('/products', vendorCtrl.createProduct);
// Add PUT and DELETE routes for products here...

export default router;