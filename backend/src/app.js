require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.handler');
const app = express();


// Global Middlewares
// 1. ALWAYS FIRST
app.use(cors({
    origin: 'http://localhost:5173', // Be specific to your frontend port
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/metadata', require('./metadata/metadata.routes')); // Added Metadata
app.use('/api/wallet', require('./modules/wallet/wallet.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/cart', require('./modules/cart/cart.routes')); // Added Cart
app.use('/api/orders', require('./modules/orders/orders.routes'));
app.use('/api/procurement', require('./modules/procurement/procurement.routes'));
app.use('/api/logistics', require('./modules/logistics/logistics.routes'));
app.use('/api/support', require('./modules/support/support.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));

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