const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');

exports.register = async (req, res, next) => {
    try {
        const {
            surname,
            first_name,
            phone,
            address,
            password,
            role,
            lga_region,
            city,
            nin
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                surname,
                first_name,
                phone,
                address,
                lga_region,
                city,
                nin,
                password_hash: hashedPassword,
                role: role || 'customer',
                wallet: {
                    create: {}
                }
            },
            select: {
                id: true,
                surname: true,
                first_name: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { phone },
            include: { wallet: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const { password_hash, ...safeUser } = user;
        res.json({ token, user: safeUser });
    } catch (error) {
        next(error);
    }
};
