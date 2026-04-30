const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./app');
const redis = require('./config/redis');
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || '*' }
});

io.on('connection', (socket) => {
    socket.on('update_location', async (data = {}) => {
        const { orderId, lat, lng } = data;

        if (!orderId || lat === undefined || lng === undefined) {
            return;
        }

        const locationKey = `rider_loc:${orderId}`;
        const locationData = JSON.stringify({ lat, lng, timestamp: Date.now() });

        await redis.set(locationKey, locationData, 'EX', 300);
        io.emit(`tracking_${orderId}`, { lat, lng });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Elvekas Backend running on port ${PORT}`);
});
