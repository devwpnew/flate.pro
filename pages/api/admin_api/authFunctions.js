import { deleteCookie, getCookie, setCookie } from "cookies-next";
import API from "../service/api";

require('dotenv').config()

const domen = process.env.DOMEN

export default async function handler(req, res) {
    try {
        let fields = null;
        if (req.method == 'GET') {
            const preFields = (req.query.fields[0] == '%' ? decodeURI(req.query.fields) : req.query.fields);
            fields = JSON.parse(preFields);
        } else if (req.method == 'POST') {
            console.log({fields: req.body.fields, f: 'authFunctions:authorize.js'})
            fields = req.body;
        }

        const native = fields?.native

        if (fields.function == 'isUserAuthorized') {

            const forwarded = req.headers["x-forwarded-for"]
            const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
            const ipModified = ip == '::1' ? '127.0.0.1' : ip

            const userAgent = !native ? req.headers['user-agent'] : fields.userDevice
            const userToken = !native ? getCookie('userToken', { req, res }) : fields.userToken

            if (!userToken) {
                res.status(200).json(false)
            } else {
                const check = await API.auth.checkUserToken(userToken, ipModified, userAgent, native)

                res.status(200).json(check)
            }
        } else if (fields.function == 'authorize') {
            if (!fields.userId) {
                res.status(200).json({ error: "ID обязателен" })
            } else {

                // console.log('fields', fields)

                const tokenVariables = fields.tokenVariables

                const tokenInfo = API.auth.generateSaltHash(tokenVariables)

                const updateUserObject = {
                    id: fields.userId,
                    last_login_date: new Date(),
                    window_host: domen
                }

                if (fields?.adminPassword) {
                    updateUserObject['password_salt'] = tokenInfo.salt
                } else {
                    if (fields?.device) {
                        updateUserObject['token_salt_app'] = tokenInfo.salt
                    } else {
                        updateUserObject['token_salt'] = tokenInfo.salt
                    }
                }

                if (fields?.device) {
                    updateUserObject['user_token_app'] = tokenInfo.userToken
                    updateUserObject['last_login_device'] = fields.device
                } else {
                    updateUserObject['user_token'] = tokenInfo.userToken
                }

                const updateUser = await API.update.user(updateUserObject)

                if (fields.pushToken) {
                    await API.update.pushToken(fields.userId, fields.pushToken, domen)
                }
                res.status(200).json({ update: updateUser.data, token: tokenInfo.userToken })
            }
        } else if (fields.function == 'passwordAuth') {

            const user = await API.get.user({
                select: ['id', 'user_name', 'password_salt', 'password', 'user_group'],
                filter: fields.userFilter,
                limit: 1,
                window_host: fields.host,
                print: true
            });

            if (user) {
                let verify = false;

                const isMasterPassOn = await API.get.setting('master_password_active') == 'Y' ? true : false
                const adminPassword = fields.adminPassword

                verify = API.auth.verifySaltHash(user.password_salt, user.password, adminPassword)

                if (verify && !verify.error) {
                    if (native) {
                        res.status(200).json({ token: user.password })
                    } else {
                        setCookie('userToken', user.password, { req, res, maxAge: 3 * 30 * 24 * 60 * 60, path: '/' }) // 3 месяца
                        res.status(200).json(verify)
                    }
                } else if (isMasterPassOn /*&& user.user_group?.id != 5 && user.user_group?.id != 1*/) {

                    const adminSalt = await API.get.setting('master_password_salt')
                    const adminToken = await API.get.setting('master_password_token')

                    verify = API.auth.verifySaltHash(adminSalt, adminToken, adminPassword)

                    if (native) {
                        res.status(200).json({ token: `${adminToken}ID:${user.id}` })
                    } else if (verify && !verify.error) {
                        setCookie('userToken', `${adminToken}ID:${user.id}`, { req, res, maxAge: 10 * 365 * 30 * 24 * 60 * 60, path: '/' }) // 10 лет
                        res.status(200).json(verify)
                    } else {
                        res.status(200).json({error: "Неверный пароль"})    
                    }
                } else {
                    res.status(200).json({error: "Неверный пароль"})
                }
            } else {
                res.status(200).json({error: 'Пользователь не найден'})
            }
        } else if (fields.function == 'exitAccount') {
            if (!native) {
                deleteCookie("userToken", { req, res });
            }
            res.status(200).json(true)
        } else if (fields.function == 'checkUpdates') {

            console.log('fields', fields)

            const type = fields.type

            const appVersion = fields.version;
            const minVersion = await API.get.version(type)

            const arAppVer = appVersion.split('.');
            const arMinVer = minVersion.split('.');

            let resAppTens = 0;
            let resAppVer = 0;
            for (let index = arAppVer.length - 1; index >= 0; index--) {
                resAppTens += 1;
                const element = arAppVer[index];
                resAppVer = resAppVer + (element * (tens(resAppTens)));
            }

            let resMinTens = 0;
            let resMinVer = 0;
            for (let index = arMinVer.length - 1; index >= 0; index--) {
                resMinTens += 1;
                const element = arMinVer[index];
                resMinVer = resMinVer + (element * (tens(resMinTens)));
            }

            console.log('resMinVer', resMinVer)
            console.log('resAppVer', resAppVer)

            if (resMinVer > resAppVer) {
                res.status(200).json({ needUpdate: true })
            } else {
                res.status(200).json({ needUpdate: false })
            }

        } else if (fields.function == 'getUpdateText') {
            const texts = await API.get.updateText();
            res.status(200).json({ texts })
        } else if (fields.function == 'testAxios') {
            const resp = await API.get.userByPhone(fields.phone)
            res.status(200).json(resp)
        } else {
            res.status(200).json(false)
        }
    } catch (error) {
        console.error(error);
        res.status(200).json(error)
    }
}

function tens(count) {
    let res = 10;
    for (let index = 1; index < count; index++) {
        res = res * 10;
    }
    return res;
}