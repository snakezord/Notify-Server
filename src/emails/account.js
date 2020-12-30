const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = ({email, name}) => {
    sgMail.send({
        to: email,
        from: 'roman.zhydyk@outlook.com',
        subject: `Thanks for joining in!`,
        html: `Welcome <strong>${name}</strong>.<br>Hope you'll enjoy my Notes App! <br> Please reach me on this email.`
    })
}

const sendByeEmail = ({email, name}) => {
    sgMail.send({
        to: email,
        from: 'roman.zhydyk@outlook.com',
        subject: `It's not a Bye!`,
        html: `We hope to see you back <strong>${name}</strong>!`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendByeEmail
}

