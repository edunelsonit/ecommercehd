let client;

if (process.env.REDIS_URL) {
    const Redis = require('ioredis');
    client = new Redis(process.env.REDIS_URL);

    client.on('error', (error) => {
        console.error('Redis connection error:', error.message);
    });
} else {
    const store = new Map();

    client = {
        async get(key) {
            const entry = store.get(key);

            if (!entry) return null;
            if (entry.expiresAt && entry.expiresAt <= Date.now()) {
                store.delete(key);
                return null;
            }

            return entry.value;
        },

        async set(key, value, mode, ttlSeconds) {
            const ttl = mode === 'EX' && Number(ttlSeconds) > 0
                ? Number(ttlSeconds) * 1000
                : null;

            store.set(key, {
                value,
                expiresAt: ttl ? Date.now() + ttl : null
            });

            return 'OK';
        },

        async del(key) {
            return store.delete(key) ? 1 : 0;
        }
    };
}

module.exports = client;
