let prisma;

function createPrismaClient() {
    const { PrismaClient } = require('@prisma/client');

    try {
        const { PrismaPg } = require('@prisma/adapter-pg');
        const { Pool } = require('pg');

        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not configured');
        }

        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        return new PrismaClient({ adapter: new PrismaPg(pool) });
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('@prisma/adapter-pg')) {
            throw new Error('Prisma 7 requires @prisma/adapter-pg. Run npm install in backend.');
        }

        throw error;
    }
}

function getPrisma() {
    if (!prisma) {
        prisma = createPrismaClient();
    }

    return prisma;
}

module.exports = new Proxy({}, {
    get(_target, property) {
        return getPrisma()[property];
    }
});
