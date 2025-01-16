const route = require('express').Router()
const crypto = require('crypto');
const adminData = require('../../model/adminSchema')
const sha = require('sha1')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const nodemailer = require('nodemailer')

route.post('/', async (req, res) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ success: false, message: 'Authorization header missing' });
        }

        // Verify and decode JWT token
        const decoded = jwt.verify(authHeader, process.env.TOKEN_KEY);
        const { oldPassword, newPassword } = req.body;

        // Find admin in the database
        const getAdmin = await adminData.findOne({ _id: decoded.id });
        if (!getAdmin) {
            return res.status(404).send({ success: false, message: 'Admin not found', type: 'email' });
        }

        // Compare old password
        if (getAdmin.password !== sha(oldPassword)) {
            return res.send({ success: false, message: 'Incorrect old password', type: 'password' });
        }

        // Update password
        await adminData.updateOne(
            { _id: decoded.id },
            { $set: { password: sha(newPassword) } }
        );

        return res.status(200).send({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ success: false, message: 'Invalid token' });
        }

        console.error('Error updating password:', error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

// OTP generator function
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};
// Route for resetting password
route.post('/reset', async (req, res) => {
    const { password, email } = req.body;

    if (email && password) {
        const getAdmin = await adminData.findOne({ email });

        if (getAdmin) {
            if (getAdmin.stage === 3) {
                await adminData.updateOne({ email }, {
                    $set: { password: sha(password).toString(), stage: 1, otp: 0 }
                });

                const ID = { id: getAdmin?._id };
                const token = jwt.sign(ID, process.env.TOKEN_KEY);

                res.send({ success: true, token: token });
            } else {
                res.send({ success: false, message: "Invalid stage for password reset." });
            }
        } else {
            res.send({ success: false, message: "Email not found." });
        }
    } else {
        res.send({ success: false, message: "Email and password are required." });
    }
});

// Route for verifying OTP
route.post('/verify-otp', async (req, res) => {
    const { otp, email } = req.body;

    if (email && otp) {
        const getAdmin = await adminData.findOne({ email });

        if (getAdmin) {
            if (getAdmin.otp === parseInt(otp) && getAdmin.stage === 2) {
                await adminData.updateOne({ email }, { $set: { stage: 3 } });
                res.send({ success: true });
            } else {
                res.send({ success: false, message: "Invalid OTP or incorrect stage." });
            }
        } else {
            res.send({ success: false, message: "Email not found." });
        }
    } else {
        res.send({ success: false, message: "OTP and email are required." });
    }
});

// Route for sending OTP
route.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (email) {
        const getAdmin = await adminData.findOne({ email });

        if (getAdmin) {
            // Generate OTP
            const otp = generateOTP();

            // Nodemailer transporter setup
            const transporter = nodemailer.createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.BREVO_SMTP_MAIL,
                    pass: process.env.BREVO_SMTP_API_KEY
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            // Email content
            const htmlContent = `
                <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset OTP</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                    <div style="background-color: #f7f7f7; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
                        <h2 style="color: #333;">Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset the password for your account associated with this email address. To proceed with resetting your password, please use the One-Time Password (OTP) provided below.</p>

                        <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; color: #007bff;">
                            Your OTP: <strong>${otp}</strong>
                        </h3>

                        <p style="color: #333;">This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email or contact our support team.</p>
                        
                        <p>To reset your password, please visit the password reset page and enter the OTP when prompted.</p>
                        
                        <p>If you need any further assistance, feel free to reach out to our support team.</p>

                        <p>Thank you, <br />The Indy Soft Wash Team</p>
                        </div>
                    </div>
                    </body>
                </html>
            `;

            // Send email
            try {
                await transporter.sendMail({
                    from: `<${process.env.BREVO_SENDER_MAIL}>`,
                    to: email,
                    subject: `Password Reset OTP`,
                    html: htmlContent,
                });

                // Save OTP and update stage
                await adminData.updateOne({ email }, { $set: { stage: 2, otp: otp } });
                res.send({ success: true });

            } catch (error) {
                console.error('Error sending email:', error);
                res.send({ success: false, message: "Error sending OTP email." });
            }
        } else {
            res.send({ success: false, message: "Email not found or incorrect stage." });
        }
    } else {
        res.send({ success: false, message: "Email is required." });
    }
});




module.exports = route;