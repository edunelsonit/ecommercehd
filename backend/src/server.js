require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const server = http.createServer(app);

// Initialize the global store at the top
global.liveLocations = {};

const io = new Server(server, {
    cors: { origin: '*' }
});

// Simple In-Memory store for tracking (Replacing Redis)
const liveLocations = {}; 

io.on('connection', (socket) => {
    socket.on('update_location', (data) => {
        const { orderId, lat, lng } = data;
        if (orderId) {
            global.liveLocations[orderId] = { lat, lng, timestamp: Date.now() };
            // Use socket.to() or rooms if you want to be more efficient than io.emit (broadcast to all)
            io.emit(`tracking_${orderId}`, { lat, lng });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});