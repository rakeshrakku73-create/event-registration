const express = require('express');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // This line links your CSS and JS files

// Route to show your new index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle the email registration
app.post('/register', async (req, res) => {
    const { name, email, event } = req.body;
    try {
        const qrImage = await qrcode.toDataURL(`Student: ${name}, Event: ${event}`);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `VIT Event Ticket: ${event}`,
            html: `<h3>Registration Confirmed!</h3><p>Hi ${name}, your ticket is attached.</p><img src="${qrImage}">`,
            attachments: [{ filename: 'ticket.png', content: qrImage.split("base64,")[1], encoding: 'base64' }]
        });
        res.send("<center><h1>Success!</h1><p>Check your Gmail for the QR code.</p></center>");
    } catch (err) { res.status(500).send("Error: " + err.message); }
});

app.listen(process.env.PORT || 10000);
