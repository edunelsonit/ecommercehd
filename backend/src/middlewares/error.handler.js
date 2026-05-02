module.exports = (err, req, res, next) => {
    // 1. Log for your terminal (Technical)
    console.error(`[Error Code: ${err.code}] ${err.message}`);

    // 2. Handle Prisma Unique Constraint (P2002)
    if (err.code === 'P2002') {
        // Find the field that caused the conflict
        // It can be in err.meta.target OR nested in driverAdapterError for Postgres
        const targetFields = err.meta?.target || 
                             err.meta?.driverAdapterError?.cause?.constraint?.fields || 
                             [];
        
        const field = targetFields[0] || 'record';

        // Map database names to clean display names
        const fieldLabels = {
            email: 'Email address',
            phone: 'Phone number',
            nin: 'NIN number'
        };

        const label = fieldLabels[field] || field;

        return res.status(400).json({
            success: false,
            message: `${label} is already registered. Please try a different one.`
        });
    }

    // 3. Handle Prisma Foreign Key Violation (P2003) - e.g., invalid Gender/State ID
    if (err.code === 'P2003') {
        return res.status(400).json({
            success: false,
            message: "Invalid reference ID provided (e.g., Gender, State, or LGA ID does not exist)."
        });
    }

    // 4. Default Generic Error
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};