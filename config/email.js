const nodemailer = require("nodemailer");

exports.smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: "naver",
    host: "smtp.naver-com",
    port: 587,
    secure: false,
    requireTls: true,
    auth: { user: process.env.SMTP_ID, pass: process.env.SMTP_PW },
    tls: 1,
    rejectUnauthorized: false,
});
