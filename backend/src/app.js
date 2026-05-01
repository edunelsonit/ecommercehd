const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.middleware'); // Renamed for consistency
const app = express();

/**
 * OPTIONAL: Remove the BigInt.prototype.toJSON line. 
 * Since we migrated the schema to 'Int', Prisma will no longer return BigInts.
 * Keeping this won't break anything, but it's no longer necessary.
 */

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/metadata', require('./modules/metadata/metadata.routes')); // Added Metadata
app.use('/api/wallet', require('./modules/wallet/wallet.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/cart', require('./modules/cart/cart.routes')); // Added Cart
app.use('/api/orders', require('./modules/orders/orders.routes'));
app.use('/api/procurement', require('./modules/procurement/procurement.routes'));
app.use('/api/logistics', require('./modules/logistics/logistics.routes'));
app.use('/api/support', require('./modules/support/support.routes'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Error Handling (Must be defined after all routes)
app.use(errorHandler);

module.exports = app;