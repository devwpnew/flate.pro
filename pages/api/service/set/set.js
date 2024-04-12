import axios from "axios";
import { setCookie } from "cookies-next";
import FormData from "form-data";
import API from "../api";
import { dateDiffInDays } from "helpers/dateFunctions";

let domen = false;

let SET = {};
export default SET = {
  item: async function setItem(fields) {
    // try {
    if (fields instanceof FormData) {
      domen = fields.get('window_host')
    } else if (fields.window_host) {
      domen = fields.window_host;
    } else if (typeof window != 'undefined') {
      domen = window.location.origin;
    }

    const res = await axios.post(
      `${domen ? domen : "https://flate.pro"}/api/admin_api/edit`,
      fields,
      (fields instanceof FormData ? {
        headers: { "Content-Type": "multipart/form-data" },
      } : {})
    );

    if (res.data.error) {
      throw { error: res.data.error };
    }
    const data = res.data;
    return data;
    // } catch (error) {
    //   console.log(error);
    // }
  },

  activeCity: function setActiveCity(city) {
    if (!city) {
      return { error: "Город обязателен" };
    }
    setCookie("city", typeof city == "object" ? city.id : city, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    window.location.reload();
  },

  emailConfirmed: async function setEmailConfirmed(userId, origin) {
    if (!userId) {
      return { error: "UserId обязателен" };
    }
    const setEmailConfirmedFields = {
      table: "users",
      id: userId,
      email_confirmed: true,
      email_confirmation: false,
      window_host: origin
    };
    const res = await API.set.item(setEmailConfirmedFields);
    return res;
  },

  userAvatar: async function setUserAvatar(form_data) {
    if (!form_data.get('id')) {
      return { error: 'ID Обязателен' }
    }
    form_data.append('table', 'users')
    const update = await API.set.item(form_data);
    return update
  },

  userPhone: async function setUserPhone(fields) {
    try {
      if (fields.phone == fields.user.phone && fields.user.phone_confirmed == true) {
        return { error: "Тот же самый номер" };
      }
      if (!fields.user) {
        return { error: "Пользователь обязателен" };
      }
      const update = await API.set.item({
        window_host: fields.window_host,
        table: "users",
        id: fields.user.id,
        phone: fields.phone,
      });
      return update;
    } catch (error) {
      console.log(error);
    }
  },

  userEmail: async function setUserEmail(fields) {
    try {
      domen = window.location.origin;

      if (!fields.email) {
        return { error: "Не указана почта" };
      }
      fields.email = fields.email.toLowerCase();
      if (fields.email == fields.user.email) {
        return { error: "Та же самая почта" };
      }

      const getUsersWithEmail = await API.get.user({ filter: { email: fields.email }, limit: 1 })

      if (getUsersWithEmail) {
        return { error: "Данная почта уже используется" }
      }
      
      if (!fields.user) {
        return { error: "Пользователь обязателен" };
      }
      fields.subject = "Подтверждение почты";
      fields.to = fields.email;
      fields.template = "email_confirmation";
      const tokenGen = API.auth.generateEmailToken();
      fields.data = { code: tokenGen };

      const update = await API.set.item({
        window_host: fields.window_host,
        table: "users",
        id: fields.user.id,
        email_confirmation: tokenGen,
        email: fields.email,
        email_confirmed: "false",
      });

      const resEmail = await axios.post(
        `${domen ? domen : "http://localhost:3000"}/api/email/sendEmail`,
        fields
      );
      return resEmail;
    } catch (error) {
      console.log(error);
    }
  },

  favoritesById: async function setFavoritesById(userId, setFavorites) {
    if (!userId) {
      return { error: "ID обязателен" };
    }
    const setFavoritesFields = {
      table: "users",
      id: userId,
      favorites: setFavorites,
    };
    const data = await API.set.item(setFavoritesFields);
    if (data) {
      return data;
    }
  },

  favorites: async function setFavorites(req, res, setFavorites) {
    let user;
    if ((user = await API.auth.isUserAuthorized(req, res))) {
      const data = this.favoritesById(user.id, setFavorites);
      if (data) {
        return data;
      }
    } else {
      return { error: "Неавторизованный пользователь или не указан ID" };
    }
  },

  userGroup: async function setUserGroup(user, group) {
    if (!user) {
      return { error: "Пользователь объект или ID обязателен" }
    }
    if (!group) {
      return { error: "Новая группа обязательна" }
    }
    const setUserGroupFields = {
      id: typeof user == 'object' ? user.id : user,
      user_group: group
    }
    const res = await API.update.user(setUserGroupFields)
    return res
  },

  ban: async function setBan(table, userId, date_banned_to, text, additionalFields = {}) {
    if (!table) {
      return { error: "table обязателен" };
    }
    if (!userId) {
      return { error: "ID обязателен" };
    }
    if (date_banned_to && !(date_banned_to instanceof Date)) {
      return { error: 'date_banned_to должен быть объектом new Date()' }
    }
    const banUserFields = {
      table: table,
      id: userId,
      date_banned: new Date(),
      date_banned_to: date_banned_to,
      ban_note: text,
      ...additionalFields
    };
    const data = await API.set.item(banUserFields);
    return data;
  },

  unban: async function setUnban(table, id, additionalFields = {}) {
    if (!userId) {
      return { error: "ID обязателен" };
    }
    const unbanUserFields = {
      table: table,
      id: id,
      date_banned: "false",
      ban_time: "false",
      ban_note: "false",
      ...additionalFields
    };
    const data = await API.set.item(unbanUserFields);
    return data;
  },

  banUser: async function setBanned(user, date_banned_to, text = '') {
    return await API.set.ban('users', typeof user == 'object' ? user.id : user, date_banned_to, text, { user_token: 'NULL', token_salt: 'NULL' })
  },

  unbanUser: async function setUnbanned(user) {
    return await API.set.unban('users', typeof user == 'object' ? user.id : user)
  },

  banProduct: async function setBanProduct(product) {
    return await API.set.ban('product', typeof product == 'object' ? product.id : product, date_banned_to, { published: '4' })
  },

  unbanProduct: async function setBanProduct(product) {
    return await API.set.unban('product', typeof product == 'object' ? product.id : product, { published: '0' })
  },

  publishProduct: async function setPublishProduct(product) {
    let prodId = false;
    let arProd = false;

    if(typeof product == 'object') {
      prodId = product.id
      arProd = await API.get.product.byID(prodId)
    } else {
      prodId = product;
      arProd = await API.get.product.byID(prodId)
    }

    const fields = {
      id: prodId,
      published: 1,
      date_published: new Date()
    };

    if(arProd?.date_sort) {
      const diff = dateDiffInDays(arProd.date_sort);
      console.log('diff', diff)
      if(diff > 30) {
        fields.date_sort = new Date();
      }
    } else {
      fields.date_sort = new Date();
    }

    // if(diff > 30) {
    //   fields.date_sort = new Date();
    // }

    const toArchiveReq = await API.update.product(fields);

    return toArchiveReq;
  },

  productPremium: async function setProductPremium(product, premValue) {
    const prodId = typeof product == 'object' ? product.id : product
    if (!prodId) {
      return { error: "Не удалось получить ID товара" }
    }
    // const test = await API.get.fieldInfo('product', 'premium')
    const update = await API.update.product({
      id: prodId,
      premium: premValue ? premValue : 3,
      date_paid: new Date()
    })
    return update
  },

  sendEditProduct: async function setEditProduct(product, text) {
    const sendEditProductFields = {
      table: "product",
      published: '3',
      edit_note: text,
      id: typeof product == 'object' ? product.id : product
    }

    const data = await API.set.item(sendEditProductFields);

    if (data?.itemId) {
      const productId = data?.itemId;
      const notif = await API.add.personalNotification({ product_id: productId, text: text }, 'sendEdit')
    }

    return data;
  },

  messagesRead: async function setMessagesRead(fields) {
    const getUnreadMessages = await API.get.messages(fields);

    if (getUnreadMessages) {
      getUnreadMessages.map(async (message) => {
        const unreadToReadFields = {
          table: "messages",
          id: message.id,
          read_by_opposite: "true",
        };
        const setMessagesRead = await API.set.item(unreadToReadFields);
      });
    }
  },

  taskStatus: async function setTaskStatus(id, status) {
    const taskStatusFields = {
      id: id,
      status: status
    }
    const res = await API.update.tasks(taskStatusFields)
    return res
  },

  taskExecutor: async function setTaskExecutor(id, executor) {
    const taskExecFields = {
      id: id,
      admin: executor
    }
    const res = await API.update.tasks(taskExecFields)
    return res
  },

  notificationsRead: async function setNotificationsRead(user, dateRead) {
    const userId = typeof user == 'object' ? user.id : user

    if (!userId) {
      return { error: "Не удалось получить ID пользователя" }
    }

    const userNotifsRead = {
      id: userId,
      date_notifications_read: dateRead instanceof Date ? dateRead : new Date()
    }

    const res = await API.update.user(userNotifsRead)
    return res
  },

  mainUserPhone: async function setMainUserPhone(phone, user) {

    const userId = typeof user == 'object' ? user.id : user

    const arUser = await API.get.user({ filter: { id: userId }, limit: 1 })
    let mainPhone = arUser.phone;

    if (!Array.isArray(arUser.additional_phones) || arUser.additional_phones.length <= 0) {
      return { error: "У пользователя нет дополнительных телефонов" }
    }
    if (!arUser.additional_phones.includes(phone)) {
      return { error: "Этот номер не принадлежит юзеру" }
    }
    if (mainPhone == phone) {
      return { error: "Этот номер уже является основным" }
    }

    const newAdditionalPhones = arUser.additional_phones.map((additionalPhone) => {
      if (additionalPhone == phone) {
        return mainPhone
      }
      return additionalPhone
    })
    mainPhone = phone;

    const updateFields = {
      id: userId,
      additional_phones: newAdditionalPhones,
      phone: mainPhone
    }

    const res = API.update.user(updateFields)
    return res
  }

};
