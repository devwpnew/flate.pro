
import API from "../api";
import FormData from "form-data";
import axios from "axios";
import api from "../api";
import { getCookie } from "cookies-next";
let domen = false;

let EMAILS = {};

export default EMAILS = {
    send: async function sendMail(mailFields, host){
        if (host) {
            domen = host;
        } else if (window?.location?.origin) {
            domen = window.location.origin
        }

        const resEmail = await axios.post(
            `${domen ? domen : "https://flate.pro"}/api/email/sendEmail`,
            mailFields
        )
        return resEmail.data
    },

    newProduct: async function sendNewProdEmail(newProdId, host) {
        const getProduct = await API.get.product.list({ filter: { id: newProdId }, limit: 1, window_host: host })

        const mailFields = {
            subject: "Добавлено объявление на модерацию.",
            template: "new_product",
            data: { product: getProduct },
            to: 'notify@flate.pro',
            from: 'notify@flate.pro',
        }

        const res = await API.sendEmailNotification.send(mailFields, host)
        return res
    },

    report: async function sendReportEmail(product = '0', user = 0, text = '', host){
        const mailFields = {
            subject: `Новая жалоба на ${product ? 'товар' : 'пользователя'}`,
            template: "abuse",
            data: { product, user, text },
            to: 'abuse@flate.pro',
            from: 'abuse@flate.pro',
        }

        const res = await API.sendEmailNotification.send(mailFields, host)
        return res
    },

    newRc: async function sendNewRcEmail(newRcId, host) {
        const getNewRc = await API.get.rcs({ filter: { id: newRcId }, limit: 1, window_host: host })

        const mailFields = {
            subject: "Добавлен ЖК на модерацию",
            template: "new_rc",
            data: { rcFields: getNewRc },
            to: 'notify@flate.pro',
            from: 'notify@flate.pro',
        }

        const res = await API.sendEmailNotification.send(mailFields, host)
        return res
    },

    unpublish: async function sendUnpublishEmail(product, user, host){
        const arProduct = typeof product == 'object' ? product : await api.get.product.list({filter: {id: product}, limit: 1, window_host: host})
        const arUser = typeof user == 'object' ? user : await api.get.user({filter: {id: user}, limit: 1, window_host: host})

        if(arUser.email){

            const mailFields = {
                subject: `У объявления ${arProduct.id} закончился срок размещения`,
                template: "unpublish_prod",
                data: { arProduct },
                to: arUser.email,
                from: 'notify@flate.pro',
            }
    
            const res = await API.sendEmailNotification.send(mailFields, host)
            return res
        }
    },

    unprem: async function sendUnpremEmail(product, user, host){
        const arProduct = typeof product == 'object' ? product : await api.get.product.list({filter: {id: product}, limit: 1, window_host: host})
        const arUser = typeof user == 'object' ? user : await api.get.user({filter: {id: user}, limit: 1, window_host: host})

        if(arUser.email){
            const mailFields = {
                subject: `У объявления ${arProduct.id} закончился срок платного размещения`,
                template: "unprem_prod",
                data: { arProduct },
                to: arUser.email,
                from: 'notify@flate.pro',
            }
    
            const res = await API.sendEmailNotification.send(mailFields, host)
            return res
        }
    },

    mainNotification: async function sendMainNotification(title, text, host){

        const getEmailsFields = {
            select: ['id', 'email'],
            filter: {
                email: '!null'
            },
            limit: 'all',
            window_host: host
        }

        const getEmails = await API.get.user(getEmailsFields);

        const arTo = [];

        if(!getEmails.Error){
            getEmails.forEach((user) => {
                arTo.push(user.email)
            })
        }

        const mailFields = {
            subject: title,
            data: { text },
            to: arTo.join(', '),
            from: 'notify@flate.pro',
        }

        const res = await API.sendEmailNotification.send(mailFields, host)
        return res
    },

    newUser: async function sendNewUserEmail(idAdd, window_host = '', registeredFrom = 'Сайт'){
        if(!idAdd){
            return {error: "Пользователь не был добавлен"}
        }

        const user = await API.get.user({filter: {id: idAdd }, limit :1})// idAdd;
        if(!user?.id) {
            return {error: "Невозможно получить пользователя по ID"}
        }

        const mailFields = {
            subject: 'Заявка на одобрение профиля',
            data: { user, registeredFrom },
            template: 'new_user',
            // to: 'notify@flate.pro',
            to: 'notify@flate.pro',
            from: 'notify@flate.pro',
        }

        const res = await API.sendEmailNotification.send(mailFields, window_host)
        return res
    },

    feedback: async function sendFeedbackEmail(data, window_host){
        
        let fields = {};

        if(data instanceof FormData){
            fields.text_why = data.get('text_why')
            fields.text_idea = data.get('text_idea')
            fields.contact = data.get('contact')
            fields.vote = data.get('vote')
        }else{
            fields.text_why = data.text_why
            fields.text_idea = data.text_idea
            fields.contact = data.contact
            fields.vote = data.vote
        }

        const mailFields = {
            subject: "Отзыв о сайте",
            data: fields,
            to: 'feedback@flate.pro',
            from: 'feedback@flate.pro',
            template: "feedback",
        }

        const res = await API.sendEmailNotification.send(mailFields, window_host)
        return res
    },

    sendEditProduct: async function sendEditProductEmail(product, user, textWhy, host){
        const arProduct = typeof product == 'object' ? product : await api.get.product.list({filter: {id: product}, limit: 1, window_host: host})
        const arUser = typeof user == 'object' ? user : await api.get.user({filter: {id: user}, limit: 1, window_host: host})

        if(arUser.email){

            const mailFields = {
                subject: "Ваше объявление не прошло модерацию",
                template: "send_edit_prod",
                data: { arProduct, textWhy },
                to: arUser.email,
                from: 'notify@flate.pro',
            }
            // console.log('host', host)
            const res = await API.sendEmailNotification.send(mailFields, host)
            return res
        }
    },

    newsNotification: async function newsNotificationEmail(news_id, host){
        const arNews = typeof news_id == 'object' ? news_id : await api.get.news({filter: {id: news_id}, limit: 1, window_host: host})
        const users = await api.get.user({filter: { email: '!false' }})
        const emails = users.map(user => user.email)

        const mailFields = {
            subject: arNews.name,
            template: "send_news_notif",
            data: { arNews },
            to: emails.join(', '),
            from: 'notify@flate.pro',
        }

        const res = await API.sendEmailNotification.send(mailFields, host)
        return res
    }
}