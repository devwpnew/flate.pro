import axios from "axios";
import { getData } from "helpers/db/getData";
import { updateItems } from "lib/postgresql/db";
import API from "../service/api";

export default async function (req, res) {

    const { phone, type, window_host, user_id } = req.method == 'POST' ? req.body : JSON.parse(req.query.fields);

    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    if (type == 'changePhone') {
        const userRegistered = await API.auth.isUserRegistered(phone, window_host)
        const userBanned = await API.auth.isPhoneBanned(phone, window_host)

        if (userRegistered) {
            res.status(200).json({ error: { status_text: "Пользователь с таким номером телефона уже зарегистрирован" } })
        }
        if (userBanned) {
            res.status(200).json({ error: { status_text: "Номер заблокирован. Если это произошло по ошибке, пожалуйста, напишите на help@flate.pro" } })
        }

        if (!userRegistered && !userBanned) {
            const makeCall = await axios.post(`https://sms.ru/code/call?phone=${phone}&ip=${ip}&api_id=${process.env.SMSRU_API_KEY}`)
            if (makeCall.data.status == 'OK') {
                await updateItems('users', { id: user_id }, { otp_code: makeCall.data.code })
                res.status(200).json({ otp_code: makeCall.data.status })
            } else {
                res.status(200).json({ errorCall: makeCall.data })
            }
        }
    } else if (type == 'call') {
        const userBanned = await API.auth.isPhoneBanned(phone, window_host)
        const userRejected = await API.auth.isPhoneRejected(phone, window_host)

        if (userBanned) {
            res.status(200).json({ error: { status_text: "Номер заблокирован. Если это произошло по ошибке, пожалуйста, напишите на help@flate.pro" } })
        } else if (userRejected) {
            res.status(200).json({ error: { status_text: "Ваша заявка на регистрацию была отклонена. Если это произошло по ошибке напишите нам на help@flate.pro" } })
        } else {
            // console.log('phone', phone)
            if (phone == '+7 (000) 000-00-00') {
                const userRegistered = await API.auth.isUserRegistered(phone, window_host)
                if (userRegistered) {
                    const resCodeUpdateFields = {
                        table: 'users',
                        filter: { phone: phone },
                        select: ['id'],
                        limit: 1,
                        window_host: window_host
                    }
                    const getUserInfo = await getData(resCodeUpdateFields);
                    if (!getUserInfo.error) {
                        res.status(200).json({ userInfo: getUserInfo, text: 'User sent auth code' })
                    }
                } else {
                    const registerModerationIsOn = await API.get.setting('register_moderation')
                    const regFields = {
                        phone: phone,
                        otp_code: '0000',
                        ip: ip,
                        user_group: registerModerationIsOn == 'Y' ? 6 : 3,
                        date_registered: new Date(),
                        window_host: window_host
                    }

                    const idAdd = await API.add.user(regFields);

                    res.status(200).json({ userInfo: idAdd, text: 'User sent registration code' })

                }
            } else {
                const makeCall = await axios.post(`https://sms.ru/code/call?phone=${phone}&ip=${ip}&api_id=${process.env.SMSRU_API_KEY}`)
                if (makeCall.data.status == 'OK') {
                    const userRegistered = await API.auth.isUserRegistered(phone, window_host)

                    if (userRegistered) {
                        await updateItems('users', { phone: phone }, { otp_code: makeCall.data.code })
                        const resCodeUpdateFields = {
                            table: 'users',
                            filter: { phone: phone, otp_code: makeCall.data.code },
                            select: ['id'],
                            limit: 1,
                            window_host: window_host
                        }
                        const getUserInfo = await getData(resCodeUpdateFields);
                        if (!getUserInfo.error) {
                            res.status(200).json({ userInfo: getUserInfo, text: 'User sent auth code' })
                        }
                    } else {

                        const registerModerationIsOn = await API.get.setting('register_moderation')

                        const regFields = {
                            phone: phone,
                            otp_code: makeCall.data.code,
                            ip: ip,
                            user_group: registerModerationIsOn == 'Y' ? 6 : 3,
                            date_registered: new Date(),
                            window_host: window_host
                        }
                        const idAdd = await API.add.user(regFields);

                        // if (registerModerationIsOn == 'Y') {
                        //     await API.sendEmailNotification.newUser(idAdd, window_host)
                        // }
                        res.status(200).json({ userInfo: idAdd, text: 'User sent registration code' })
                    }
                } else {
                    res.status(200).json({ error: makeCall.data })
                }
            }
        }
    } else {
        const otpPass = Math.floor(1000 + Math.random() * 9000);
        const { SMSRu } = require('node-sms-ru')
        const smsRu = new SMSRu(process.env.SMSRU_API_KEY);
        const answer = await smsRu.sendSms({
            from: 'FLATE.PRO',
            to: phone,
            msg: `Код для сайта flate.pro: ${otpPass}`
        });
        if (answer.status_code == 100 && answer.sms[phone].status == 'OK') {
            const userRegistered = await API.auth.isUserRegistered(phone, window_host)
            if (userRegistered) {
                await updateItems('users', { phone: phone }, { otp_code: otpPass })
                const resCodeUpdateFields = {
                    filter: { phone: phone, otp_code: otpPass },
                    select: ['id'],
                    limit: 1,
                    window_host: window_host
                }
                const getUserInfo = await API.get.user(resCodeUpdateFields);
                if (!getUserInfo.error) {
                    res.status(200).json({ userInfo: getUserInfo, text: 'User sent auth code' })
                }
            } else {
                const regFields = {
                    phone: phone,
                    otp_code: otpPass,
                    ip: ip,
                    user_group: 6,
                    date_registered: new Date(),
                    window_host: window_host
                }
                const idAdd = await API.add.user(regFields);
                res.status(200).json({ userInfo: idAdd, text: 'User sent registration code' })
            }
        } else {
            res.status(200).json({ error: answer })
        }
    }

}