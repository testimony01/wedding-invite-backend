const express = require('express');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});

const db = admin.firestore();

app.get('/', (req, res) => {
    res.send("Welcome to the Wedding Invite API! Available endpoints: /register, /rsvp");
});

app.post('/register', async (req, res) => {
    const { name, email, mobile, guest_number } = req.body;
    const barcode = uuidv4();
    
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(barcode);
        await db.collection('guests').doc(barcode).set({ name, email, mobile, guest_number, barcode });
        res.json({ barcode, qrCode: qrCodeDataUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error generating barcode' });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/rsvp', async (req, res) => {
    const { barcode, status } = req.body;
    await db.collection('guests').doc(barcode).update({ rsvp_status: status });
    res.json({ message: 'RSVP updated' });
});