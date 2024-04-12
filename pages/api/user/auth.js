import { setCookie, getCookie } from 'cookies-next';
import { getData } from "helpers/db/getData";
import { pbkdf2Sync, randomBytes } from 'crypto';
import axios from 'axios';
import API from '../service/api';

export const hashUserToken = (tokenVariables, salt) => {
  return pbkdf2Sync(tokenVariables, salt, 10000, 64, 'sha1').toString('base64');
}

export const generateEmailToken = () => {
  return randomBytes(25).toString('hex')
}

export const generateSaltHash = (tokenVariables) => {
  let randomBytesBuf = randomBytes(25);
  let salt = randomBytesBuf.toString('hex');

  const userToken = hashUserToken(tokenVariables, salt);

  return {
    'userToken': userToken,
    'salt': salt
  }
}

export const verifySaltHash = (salt, hashedUserToken, tokenVariables) => {
  let newHashedUserToken = hashUserToken(tokenVariables, salt);
  if (hashedUserToken === newHashedUserToken)
    return true;

  return false;
}

export async function isUserRegistered(phone) {
  const checkUserExistFIelds = {
    table: "users",
    filter: { phone: phone },
    limit: 1,
    select: [
      'id'
    ]
  }
  const getUserId = await getData(checkUserExistFIelds)
  if (!getUserId.error) {
    return { userId: getUserId }
  } else {
    return false
  }
}

export async function isUserAuthorized(req, res) {

  const forwarded = req.headers["x-forwarded-for"]
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  const ipModified = ip == '::1' ? '127.0.0.1' : ip

  const userAgent = req.headers['user-agent']
  const userToken = getCookie('userToken', { req, res })

  if (!userToken) {
    return false;
  }

  const check = await checkUserToken(userToken, ipModified, userAgent)

  return (check)
}

export async function authorizeUser(userId, ip, userAgent, domen, adminPassword) {

  let tokenInfo = adminPassword ? generateSaltHash(adminPassword) : generateSaltHash(userAgent + '-' + userId)

  let sendData = new FormData()
  sendData.append('id', userId)
  sendData.append('table', 'users')
  sendData.append('ip', ip)
  if (adminPassword) {
    sendData.append('password_salt', tokenInfo.salt)
  } else {
    sendData.append('token_salt', tokenInfo.salt)
  }
  sendData.append('user_token', tokenInfo.userToken)
  sendData.append('last_login_ip', ip)
  sendData.append('last_user_agent', userAgent)

  const addTokenToUser = await axios.post(`${domen}/api/admin_api/edit`, sendData, { headers: { 'Content-Type': 'multipart/form-data' } })
  if (addTokenToUser.data.error) {
    return addTokenToUser.data
  } else if (addTokenToUser.data.itemId) {
    setCookie('userToken', tokenInfo.userToken, { maxAge: 10 * 365 * 30 * 24 * 60 * 60, path: '/' })

    return {id: addTokenToUser.data.itemId}

    // window.location.reload()
  } else {
    return ({ error: "Произошла необрабатываемая ошибка" })
  }
}

export async function checkUserToken(userToken, ip, currentUserAgent) {

  if (!userToken || !ip) {
    return { error: 'IP и токен обязательны' }
  }

  const getUser = await API.get.user( { filter: { logicOr: {user_token: userToken, password: userToken} }, limit: 1 } )
  
  if (getUser) {
    if (getUser.password == userToken) {
      return getUser;
    } else if(getUser.user_token == userToken){
      // if(getUser.last_login_ip){
      //   if (ip != getUser.last_login_ip) {
      //     return false;
      //   }
      // }
      if(getUser.last_user_agent){
        if (currentUserAgent != getUser.last_user_agent) {
          return false;
        }
      }
      if (verifySaltHash(
        getUser.token_salt,
        getUser.user_token,
        currentUserAgent + '-' + getUser.id)) {
        return getUser;
      }
    }
  } else {
    return { error: "Сессия закончилась или сброшена другой авторизацией" }
  }
}