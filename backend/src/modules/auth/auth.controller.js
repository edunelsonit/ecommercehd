const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");
const { sendOTP } = require("../../utils/mailer");
const crypto = require("crypto");

exports.register = async (req, res, next) => {
  try {
    const { email, phone, password, genderId } = req.body;

    // Basic validation
    if (!email || !phone || !password || !genderId) {
      return res
        .status(400)
        .json({ message: "Email, phone, password, and gender are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        genderId: parseInt(genderId),
        passwordHash: hashedPassword,
        role: "customer",
        wallet: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res
      .status(201)
      .json({ message: "Account created! Please update your profile.", user });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.createVendorProfile = async (req, res, next) => {
  try {
    const { businessName, vendorType } = req.body;

    if (!businessName || !vendorType) {
      return res
        .status(400)
        .json({ message: "businessName and vendorType are required" });
    }

    // req.user.id is now a standard Number/Int
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        role: req.user.role === "customer" ? "vendor" : req.user.role,
        vendorProfile: {
          upsert: {
            update: { businessName, vendorType },
            create: { businessName, vendorType },
          },
        },
      },
      include: {
        wallet: true,
        vendorProfile: true,
      },
    });

    const token = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    const { passwordHash, ...safeUser } = updatedUser;
    res.status(201).json({ token, user: safeUser });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        // vendorProfile included if needed for role-based logic
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    // Explicitly pick ONLY what the frontend needs
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      surname: user.surname,
      phone: user.phone,
      role: user.role,
      image: user.image,
      balance: user.wallet?.balance || "0", // Flattening the wallet object
    };

    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateProfile = async (req, res, next) => {
    try {
         // From protect middleware
        
        const data = req.body;
        
        //const userId = req.user.id;
        const userId = Number(data.id);
        console.log(userId);
        console.log(data)
        const updatedUser = await prisma.user.update({
            
            where: { id: Number(userId) },
            data: {
                surname: data.surname,
                firstName: data.firstName,
                otherName: data.otherName,
                dob: data.dob ? new Date(data.dob) : null,
                phone: data.phone,
                nationality: data.nationality,
                stateId: data.stateId,
                lgaId: data.lgaId,
                city: data.city,
                address: data.address,
                nin: data.nin,
                tin: data.tin,
                // Do NOT include role or passwordHash here for security
            },
            include: {
                wallet: true,
                state: true,
                lga: true
            }
        });

        // Construct the safe response object
        const { passwordHash, passwordResetToken, passwordResetExpires, ...safeUser } = updatedUser;
        
        // Flatten balance for frontend ease
        safeUser.balance = updatedUser.wallet?.balance || "0";

        res.status(200).json({
            success: true,
            user: safeUser
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Phone or NIN already exists" });
        }
        next(error);
    }
};

// STEP 1: Generate & Send OTP
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedOtp,
        passwordResetExpires: new Date(Date.now() + 10 * 60000),
      },
    });

    // SEND THE ACTUAL EMAIL
    try {
      await sendOTP(email, otp);
      res.json({
        success: true,
        message: "A 6-digit code has been sent to your email.",
      });
    } catch (mailError) {
      console.error("Email Error:", mailError);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to send email. Please try again later.",
        });
    }
  } catch (error) {
    next(error);
  }
};

// STEP 2: Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        email,
        passwordResetToken: hashedOtp,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    res.json({
      success: true,
      message: "OTP verified. Proceed to reset password.",
    });
  } catch (error) {
    next(error);
  }
};

// STEP 3: Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        email,
        passwordResetToken: hashedOtp,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Session expired. Please restart." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null, // Clear after use
        passwordResetExpires: null,
      },
    });

    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
    try {
        // req.user.id comes from your Protect Middleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { wallet: true }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const safeUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            surname: user.surname,
            otherName:user.otherName,
            genderId:user.genderId,
            phone: user.phone,
            role: user.role,
            nationality: user.nationality,
            address: user.address,
            balance: user.wallet?.balance || "0",
            image: user.image,
            dob: user.dob,
            city: user.city,
            address: user.address,
            nin: user.nin,
            tin: user.tin,
        };

        res.json(safeUser);
    } catch (error) { next(error); }
};