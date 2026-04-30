let prisma;

function getDatabaseUrl() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not configured');
    }

    const url = new URL(databaseUrl);

    if (url.username === 'postgress') {
        url.username = 'postgres';
        console.warn('DATABASE_URL username was "postgress"; using "postgres" instead.');
    }

    return url.toString();
}

function createPrismaClient() {
    const { PrismaClient } = require('@prisma/client');

    try {
        const { PrismaPg } = require('@prisma/adapter-pg');
        const { Pool } = require('pg');

        const pool = new Pool({ connectionString: getDatabaseUrl() });
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
