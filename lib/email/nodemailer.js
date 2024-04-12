import nodemailer from 'nodemailer';
import newAbuse from './templates/abuse';
import emailConfirmationTemplate from './templates/email_confirmation';
import feedbackTemplate from './templates/feedback';
import NewsNotifTemplate from './templates/news_notif';
import NewProductTemplate from './templates/new_product';
import NewRcTemplate from './templates/new_rc';
import NewUserNotifTemplate from './templates/new_user';
import SendEditProdTemplate from './templates/send_edit_prod';
import UnpremTemplate from './templates/unprem';
import UnpublishTemplate from './templates/unpublish';

require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

export function sendEmail(from = 'help@flate.pro', to = 'help@flate.pro', subject = "Sending Email using Node.js", template, data = {}) {
    try {

        const emailTemplateObject = emailTemplate(template, to, data)

        let resFields = { from: from, to: to, subject: subject }

        if (!emailTemplateObject.error) {
            resFields = { ...resFields, ...emailTemplateObject }
            const emailResult = transporter.sendMail(resFields, function (error, info) {
                if (error) {
                    return ({ result: false, info: error });
                } else {
                    return ({ result: true, info: info });
                }
            });
            return emailResult
        } else {
            return { error: emailTemplate.error }
        }
    } catch (error) {
        return { error }
    }
}

function emailTemplate(template = 'default', to, data = {}) {
    let result = {}

    if (template == 'default') {
        result.text = data.text //  Никаких действий с текстом
    } else if (template == 'email_confirmation') {
        result.html = emailConfirmationTemplate(data.code, to)
    } else if (template == 'new_rc') {
        result.html = NewRcTemplate(data.rcFields)
    } else if (template == 'new_product') {
        result.html = NewProductTemplate(data.product)
    } else if (template == 'abuse') {
        result.html = newAbuse(data)
    } else if (template == 'unpublish_prod') {
        result.html = UnpublishTemplate(data.arProduct)
    } else if (template == 'unprem_prod') {
        result.html = UnpremTemplate(data.arProduct)
    } else if(template == 'feedback'){
        result.html = feedbackTemplate(data)
    } else if (template == 'send_edit_prod') {
        result.html = SendEditProdTemplate(data.arProduct, data.textWhy);
    } else if (template == 'send_news_notif'){
        result.html = NewsNotifTemplate(data.arNews);
    } else if (template == 'new_user'){
        result.html = NewUserNotifTemplate(data)
    } else if(template == 'html'){
        result = data.html
    }

    if (!result) {
        return { error: 'No text accepted' }
    } else {
        return { ...result }
    }
}