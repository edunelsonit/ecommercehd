const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error.handler');
const app = express();

BigInt.prototype.toJSON = function toJSON() {
    return this.toString();
};

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/wallet', require('./modules/wallet/wallet.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/orders', require('./modules/orders/orders.routes'));
app.use('/api/procurement', require('./procurement/procurement.routes'));
app.use('/api/logistics', require('./logistics/logistics.routes'));
app.use('/api/support', require('./support/support.routes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;
