const validRoles = new Set(['customer', 'superadmin', 'vendor', 'rider', 'organization', 'admin']);

const registerSchema = {
    validate(payload) {
        const requiredFields = ['surname', 'first_name', 'phone', 'nin', 'address', 'password', 'lga_region', 'city'];

        for (const field of requiredFields) {
            if (!payload[field]) {
                return { error: { details: [{ message: `${field} is required` }] } };
            }
        }

        if (!/^[0-9]{11,14}$/.test(payload.phone)) {
            return { error: { details: [{ message: 'phone must contain 11 to 14 digits' }] } };
        }

        if (!/^[0-9]{11}$/.test(payload.nin)) {
            return { error: { details: [{ message: 'nin must contain 11 digits' }] } };
        }

        if (String(payload.password).length < 6) {
            return { error: { details: [{ message: 'password must be at least 6 characters' }] } };
        }

        if (payload.role && !validRoles.has(payload.role)) {
            return { error: { details: [{ message: 'role is invalid' }] } };
        }

        return { value: payload };
    }
};

module.exports = { registerSchema };
