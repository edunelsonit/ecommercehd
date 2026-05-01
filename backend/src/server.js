const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: '*' }
});

// Simple In-Memory store for tracking (Replacing Redis)
const liveLocations = {}; 

io.on('connection', (socket) => {
    socket.on('update_location', (data) => {
        const { orderId, lat, lng } = data;
        
        if (orderId) {
            // Store in global memory so the GET /track/:orderId route can see it
            global.liveLocations = global.liveLocations || {};
            global.liveLocations[orderId] = { 
                lat, 
                lng, 
                timestamp: Date.now() 
            };

            // Broadcast to the customer in real-time
            io.emit(`tracking_${orderId}`, { lat, lng });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});