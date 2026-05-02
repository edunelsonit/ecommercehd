const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.elvekas.com.ng', // Your webmail SMTP host
    port: 465, // Usually 465 for SSL or 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER, // Replace with your actual email
        pass: process.env.MAIL_PASS   // Replace with your actual password
    },
    tls: {
        rejectUnauthorized: false // Helps avoid issues with self-signed certs on shared hosting
    }
});

const sendOTP = async (to, otp) => {
    const mailOptions = {
        from: '"Elvekas Support" <info@elvekas.com.ng>',
        to: to,
        subject: 'Password Reset Code - Elvekas',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #f97316;">Reset Your Password</h2>
                <p>Hello,</p>
                <p>You requested a password reset. Use the code below to proceed. This code expires in 10 minutes.</p>
                <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; border-radius: 5px;">
                    ${otp}
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                    If you did not request this, please ignore this email.
                </p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };