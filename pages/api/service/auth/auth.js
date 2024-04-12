import { setCookie, getCookie } from "cookies-next";
import { pbkdf2Sync, randomBytes } from "crypto";
import axios from "axios";
import API from "../api";
import api from "../api";

let domen = false;

let AUTH = {};
export default AUTH = {
  hashUserToken: (tokenVariables, salt) => {
    if (typeof tokenVariables == 'number') {
      tokenVariables = tokenVariables.toString()
    }
    return pbkdf2Sync(tokenVariables, salt, 10000, 64, "sha1").toString(
      "base64"
    );
  },

  generateEmailToken: () => {
    return randomBytes(25).toString("hex");
  },

  generateSaltHash: (tokenVariables) => {
    let randomBytesBuf = randomBytes(25);
    let salt = randomBytesBuf.toString("hex");

    const userToken = API.auth.hashUserToken(tokenVariables, salt);

    return {
      userToken: userToken,
      salt: salt,
    };
  },

  verifySaltHash: (salt, hashedUserToken, tokenVariables) => {
    if (!salt || !hashedUserToken || !tokenVariables) {
      return false;
    }
    let newHashedUserToken = API.auth.hashUserToken(tokenVariables, salt);

    return hashedUserToken === newHashedUserToken ? true : false;
  },

  isUserRegistered: async function isUserRegistered(
    phone,
    window_host = false
  ) {
    const checkUserExistFields = {
      table: "users",
      filter: { logicOr: { phone: phone, additional_phones: phone } },
      limit: 1,
    };
    if (window_host) {
      checkUserExistFields["window_host"] = window_host;
    }
    const getUserId = await api.get.data(checkUserExistFields);
    if (getUserId && !getUserId.Error) {
      if (Array.isArray(getUserId) && getUserId.length > 0) {
        return getUserId[0].id ? true : false;
      }
      return getUserId.id ? getUserId.id : false;
    }
    return false;
  },

  isPhoneBanned: async function isPhoneBanned(phone, window_host) {
    const checkUserExistFields = {
      table: "users",
      filter: { phone: phone },
      limit: 1,
      window_host: window_host,
    };

    if (window_host) {
      checkUserExistFields["window_host"] = window_host;
    }
    const getUserId = await api.get.data(checkUserExistFields);

    if (getUserId) {
      const userBanned = await api.get.isUserBanned(getUserId, window_host);
      return userBanned;
    }

    return false;
  },

  isPhoneRejected: async function isPhoneRejected(phone, window_host) {
    const checkUserExistFields = {
      table: "users",
      filter: { phone: phone },
      limit: 1,
      window_host: window_host,
    };

    if (window_host) {
      checkUserExistFields["window_host"] = window_host;
    }
    const getUserId = await api.get.data(checkUserExistFields);

    return getUserId && (getUserId.user_group == "7" || getUserId.user_group.id == "7") ? true : false;
  },

  isUserAuthorized: async function isUserAuthorized(req, res) {
    try {
      let fields = null;
      if (req?.query?.fields) {
        if (req.method == "GET") {
          fields = JSON.parse(req.query.fields);
        } else if (req.method == "POST") {
          fields = req.body;
        }
      }

      const native = fields?.native;

      const forwarded = req.headers["x-forwarded-for"];
      const ip = forwarded
        ? forwarded.split(/, /)[0]
        : req.connection.remoteAddress;
      const ipModified = ip == "::1" ? "127.0.0.1" : ip;

      const userAgent = req.headers["user-agent"];
      const userToken = getCookie("userToken", { req, res });

      if (!userToken) {
        return false;
      }

      const check = await API.auth.checkUserToken(
        userToken,
        ipModified,
        userAgent,
        native
      );

      if(check?.id){
        API.update.user({ id: check?.id, last_login_date: new Date() })
      }

      return check;
    } catch (e) {
      console.log('isUserAuthorized', { Error: e })
      return false
    }
  },

  authorizeUser: async function authorizeUser(
    userId,
    ip,
    userAgent,
    domen,
    adminPassword
  ) {
    let tokenInfo = adminPassword
      ? API.auth.generateSaltHash(adminPassword)
      : API.auth.generateSaltHash(userAgent + "-" + userId);

    let sendData = new FormData();
    sendData.append("id", userId);
    sendData.append("table", "users");
    sendData.append("ip", ip);
    if (adminPassword) {
      sendData.append("password_salt", tokenInfo.salt);
    } else {
      sendData.append("token_salt", tokenInfo.salt);
    }
    sendData.append("user_token", tokenInfo.userToken);
    sendData.append("last_login_ip", ip);
    sendData.append("last_user_agent", userAgent);
    sendData.append("last_login_date", new Date());

    const addTokenToUser = await axios.post(
      `${domen}/api/admin_api/edit`,
      sendData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (addTokenToUser.data.Error) {
      return addTokenToUser.data;
    } else if (addTokenToUser.data.itemId) {
      setCookie("userToken", tokenInfo.userToken, {
        maxAge: 10 * 365 * 30 * 24 * 60 * 60,
        path: "/",
      });
      const getUserInfo = await API.get.user({
        window_host: domen,
        filter: { id: userId },
        limit: "1",
      });
      return {
        id: addTokenToUser.data.itemId,
        visited: getUserInfo.last_login_date ? true : false,
      };
    } else {
      return { Error: "Произошла необрабатываемая ошибка" };
    }
  },

  authorizeUserAxios: async function authUserAxios(userId, host) {
    const res = await axios.post(
      `${host ? host : "https://flate.pro"}/api/admin_api/authFunctions`,
      { userId: userId }
    );
    return res;
  },

  userPasswordAuth: async function userPasswordAuth(
    userFilter,
    ip,
    userAgent,
    adminPassword,
    host
  ) {
    if (!ip) {
      return { Error: "IP обязателен" };
    }
    if (!userFilter) {
      return { Error: "Фильтр пользователя обязателен" };
    }

    const verify = await axios.post(
      `${host ? host : "https://flate.pro"}/api/admin_api/authFunctions`,
      {
        function: "passwordAuth",
        userFilter,
        ip,
        userAgent,
        adminPassword,
        host,
      }
    );

    return verify.data;
  },

  checkUserToken: async function authCheckUserToken(userToken, ip, currentUserAgent, native) {
    try {
      if (!userToken || !ip) {
        return { Error: "IP и токен обязательны" };
      }

      let getUser = false;
      const userFilter = {
        logicOr: {
          user_token: userToken,
          user_token_app: userToken,
          password: userToken,
        },
      };
      const isMasterPassOn = (await API.get.setting("master_password_active")) == "Y" ? true : false;
      const adminToken = await API.get.setting("master_password_token");
      if (isMasterPassOn && userToken.indexOf(adminToken) + 1) {
        // userToken.
        const splitAdminAuthToken = userToken.split("ID:");
        const token = splitAdminAuthToken[0];
        const userId = splitAdminAuthToken[1];
        if (adminToken == token) {
          getUser = await API.get.user({ filter: { id: userId }, limit: 1 });
          if (getUser) {
            return getUser;
          }
        }
      } else {
        const select = [
          "id",
          "user_group",
          "password",
          "user_token",
          "last_user_agent",
          "token_salt",
          "user_token_app",
          "token_salt_app",
          "last_login_device",
          "last_login_date"
        ]
        getUser = await API.get.user({
          select,
          filter: userFilter,
          limit: 1,
        });
      }

      if (getUser) {
        if (getUser.user_group == "7" || getUser.user_group.id == "7") {
          // return { Error: "Пользователь отклонён" };
          console.log({ Error: "Пользователь отклонён" })
          return false
        }
        if (await API.get.isUserBanned(getUser)) {
          console.log({ Error: "Пользователь заблокирован" })
          return false
          // return { Error: "Пользователь заблокирован" };
        }
        if (getUser.password == userToken) {
          const arUser = await API.get.user({ filter: userFilter, limit: 1 });
          if(arUser) {
            return arUser
          }
        } else if (getUser.user_token == userToken || getUser.user_token_app == userToken) {

          if (native && getUser.last_login_device && currentUserAgent != getUser.last_login_device) {
            return { Error: "Устройство изменилось" };
          } else if (
            !native &&
            getUser.last_user_agent &&
            currentUserAgent != getUser.last_user_agent
          ) {
            return { Error: "Устройство изменилось" };
          }

          const salt =
            getUser.user_token == userToken 
              ? getUser.token_salt
              : getUser.token_salt_app;
          const token =
            getUser.user_token == userToken
              ? getUser.user_token
              : getUser.user_token_app;

          const variables = currentUserAgent + "-" + getUser.id;
          
          const verify = API.auth.verifySaltHash(salt, token, variables)
          if (verify) {
            const arUser = await API.get.user({ filter: userFilter, limit: 1 });
            if(arUser) {
              return arUser
            }
          }
        }
      }
      return false;
    } catch (e) {
      console.log('checkUserToken', { Error: e })
      return false
    }
  },

  exitAccount: async function authExitAccount(host) {
    const res = await axios.post(
      `${host ? host : "https://flate.pro"}/api/admin_api/authFunctions`,
      { function: "exitAccount" }
    );
    return res.data;
  },
};
