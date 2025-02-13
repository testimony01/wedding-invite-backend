import admin from "firebase-admin";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) return res.status(400).json({ message: "All fields required" });

    const guestId = uuidv4();
    const qrCode = await QRCode.toDataURL(guestId);

    try {
        // Save to Firestore
        const db = admin.firestore();
        await db.collection("guests").doc(guestId).set({ name, email, mobile, guestId, qrCode });

        // Send email with QR code
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
        });

        await transporter.sendMail({
            from: `"Wedding Invite" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Wedding Invitation QR Code",
            html: `<h2>Hello ${name},</h2><p>Your unique wedding invitation QR code is below:</p><img src="${qrCode}" />`,
        });

        res.status(200).json({ message: "Registration successful! QR Code sent to email." });

    } catch (error) {
        res.status(500).json({ message: "Error processing registration." });
    }
}
