const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS);
console.log("MONGO_URI =", process.env.MONGO_URI);


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send( {message: "No user found with that email."});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send({message: "Password is incorrect"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, message: "Logged in successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        user.resetToken = resetToken;

        user.resetTokenExpiry =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl =
            `http://localhost:5173/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset</h2>

                <p>
                    Click the link below to reset
                    your password:
                </p>

                <a href="${resetUrl}">
                    Reset Password
                </a>

                <p>
                    This link expires in 15 minutes.
                </p>
            `
        });

        res.status(200).json({
            message:
                "Password reset link sent successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid or expired token"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({
            message:
                "Password reset successful"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};