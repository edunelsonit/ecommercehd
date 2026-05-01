const prisma = require('../config/db');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
        res.json(categories);
    } catch (error) { next(error); }
};

exports.getStates = async (req, res, next) => {
    try {
        const { countryId } = req.params;
        const states = await prisma.state.findMany({
            where: { countryId: parseInt(countryId) },
            orderBy: { name: 'asc' }
        });
        res.json(states);
    } catch (error) { next(error); }
};

exports.getLGAs = async (req, res, next) => {
    try {
        const { stateId } = req.params;
        const lgas = await prisma.localGovernment.findMany({
            where: { stateId: parseInt(stateId) },
            orderBy: { name: 'asc' }
        });
        res.json(lgas);
    } catch (error) { next(error); }
};