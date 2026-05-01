const validRoles = new Set(['customer', 'superadmin', 'vendor', 'rider', 'organization', 'admin']);

const registerSchema = {
    validate(payload) {
        // Matches your standard camelCase schema fields
        const requiredFields = ['surname', 'firstName', 'phone', 'nin', 'address', 'password', 'genderId', 'city'];

        for (const field of requiredFields) {
            if (!payload[field]) {
                return { error: { details: [{ message: `${field} is required` }] } };
            }
        }

        if (!/^[0-9]{11,14}$/.test(payload.phone)) {
            return { error: { details: [{ message: 'Phone must be 11-14 digits' }] } };
        }

        if (!/^[0-9]{11}$/.test(payload.nin)) {
            return { error: { details: [{ message: 'NIN must be exactly 11 digits' }] } };
        }

        if (String(payload.password).length < 6) {
            return { error: { details: [{ message: 'Password must be at least 6 characters' }] } };
        }

        if (payload.role && !validRoles.has(payload.role)) {
            return { error: { details: [{ message: 'Invalid role provided' }] } };
        }

        return { value: payload };
    }
};

module.exports = { registerSchema };