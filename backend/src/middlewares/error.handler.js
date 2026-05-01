module.exports = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    // Prisma specific error handling
    if (err.code === 'P2002') {
        return res.status(400).json({ 
            success: false, 
            message: 'A record with this value already exists.' 
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};