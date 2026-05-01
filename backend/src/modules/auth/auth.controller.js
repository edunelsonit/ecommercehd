const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');

exports.register = async (req, res, next) => {
    try {
        const {
            surname,
            firstName,  // Updated from first_name
            otherName,
            genderId,   // New required Int
            phone,
            address,
            password,
            role,
            stateId,    // New relation Int
            lgaId,      // New relation Int
            city,
            email,
            nin
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                surname,
                firstName,
                otherName,
                genderId: parseInt(genderId),
                phone,
                address,
                stateId: stateId ? parseInt(stateId) : null,
                lgaId: lgaId ? parseInt(lgaId) : null,
                city,
                email,
                nin,
                passwordHash: hashedPassword, // Matches @map("password_hash")
                role: role || 'customer',
                wallet: {
                    create: {} // Automatically creates associated wallet
                }
            },
            select: {
                id: true,
                surname: true,
                firstName: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        next(error);
    }
};

exports.createVendorProfile = async (req, res, next) => {
    try {
        const { businessName, vendorType } = req.body;

        if (!businessName || !vendorType) {
            return res.status(400).json({ message: 'businessName and vendorType are required' });
        }

        // req.user.id is now a standard Number/Int
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                role: req.user.role === 'customer' ? 'vendor' : req.user.role,
                vendorProfile: {
                    upsert: {
                        update: { businessName, vendorType },
                        create: { businessName, vendorType }
                    }
                }
            },
            include: {
                wallet: true,
                vendorProfile: true
            }
        });

        const token = jwt.sign(
            { id: updatedUser.id, role: updatedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const { passwordHash, ...safeUser } = updatedUser;
        res.status(201).json({ token, user: safeUser });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        
        const user = await prisma.user.findUnique({
            where: { phone },
            include: { 
                wallet: true,
                vendorProfile: true 
            }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const { passwordHash, ...safeUser } = user;
        res.json({ token, user: safeUser });
    } catch (error) {
        next(error);
    }
};