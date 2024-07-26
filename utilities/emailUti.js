const nodemailer = require("nodemailer")

        const tp = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            secure: true,
            port: 465
        });
        
        
        async function sendEmail(to, subject, body) {
            await tp.sendMail({
                from: process.env.EMAIL_USERNAME,
                to,
                subject,
                html: body
            })
            
};

module.exports = {
    sendEmail
}

//`Click the following link to reset your password: http://localhost:3000/reset-password/${token}`