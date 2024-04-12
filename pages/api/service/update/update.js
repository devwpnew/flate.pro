import axios from "axios";
import FormData from "form-data";
import { sleep } from "helpers/db/getList";
import { checkproductPremium, reGenerateProductCode, reGenerateProductImage, regenerateProductInfo, reGenerateProductName } from "helpers/productFunctions";
import { generateSaltHash } from "pages/api/user/auth";
import API from "../api";
import api from "../api";

let domen = false;

let UPDATE = {};
export default UPDATE = {
  item: async function updateItem(data) {
    try {
      if (data.window_host) {
        domen = data.window_host;
      } else if (typeof window != 'undefined') {
        domen = window.location.origin;
      }

      const sendEditRequest = await axios.post(
        `${domen ? domen : "https://flate.pro"}/api/admin_api/edit`,
        data,
        data instanceof FormData && {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return sendEditRequest;
    } catch (error) {
      return error;
    }
  },

  tasks: async function updateTasks(fields) {
    const tasksFields = {
      table: "tasks",
      ...fields
    }
    const res = await API.update.item(tasksFields);
    return res
  },

  reports: async function updateReports(fields) {
    const tasksFields = {
      table: "reports",
      ...fields
    }
    const res = await API.update.item(tasksFields);
    return res
  },

  productsByFilter: async function updateProductsByFilter(filter, update, limit) {
    try {
      const getProdsFields = {
        table: 'product',
        filter,
        limit
      }
      const getProds = await API.get.product.list(getProdsFields)
      if (Array.isArray(getProds) && getProds.length) {
        const testUpd = await Promise.all(
          getProds.map(async (elem) => {
            return await API.update.product({ id: elem.id, ...update })
          })
        )
        console.log('testUpd', testUpd)
      }
    } catch (Error) {
      console.error({Error})
    }
  },

  product: async function updateProduct(data) {
    const curDate = new Date()

    if (data instanceof FormData) {
      data.append("table", "product");

      if (!data.get('id')) {
        throw { error: 'ID обязателен при обновлении' };
      }

      if (data.get('published') == 1) {
        data.append('date_published', curDate)
      }

      if (data.get('premium') != 0 && !data.get('date_paid')) {
        data.append('date_paid', new Date())
      }

    } else {
      data.table = "product"

      if (!data.id) {
        throw { error: 'ID обязателен при обновлении' };
      }

      if (data.published == 1) {
        data.date_published = curDate
      }

    }

    const res = { full: '', name: '' };

    res.full = await API.update.item(data);

    console.log('res', res)

    if (res?.full?.data?.error) {
      throw { error: res.full.data.error };
    }

    res.generate = await regenerateProductInfo(res.full.data.itemId)

    return res
  },

  regenerateAllProductNames: async function () {
    const getAllProducts = await api.get.product.list({limit: 'all', select: ['id'], sort: {id: 'ASC'}})
    for (const product of getAllProducts) {
      await reGenerateProductName(product.id);
    }
  },

  regenerateAllProductCodes: async function () {
    const getAllProducts = await api.get.product.list({limit: 'all', select: ['id'], sort: {id: 'ASC'}})
    for (const product of getAllProducts) {
      await reGenerateProductCode(product.id);
    }
  },

  user: async function updateUser(data) {
    let sef_code = '';
    
    if (data instanceof FormData) {

      data.append("table", "users");
      if (data.get('sef_code')) {
        sef_code = data.get('sef_code');
      }

      if(!data.get("id") ) {
        return {Error: "ID пользователя обязателен"}
      }

    } else {
      if (data.sef_code) {
        sef_code = data.sef_code
      }

      if(!data.id) {
        return {Error: "ID пользователя обязателен"}
      }

      data.table = "users"
    }
    if (sef_code) {
      if (sef_code.length < 5) {
        return { error: 'Слишком короткий никнейм' }
      }

      sef_code = sef_code.toLowerCase()

      if (sef_code == 'admin' || sef_code == 'administrator') {
        return { error: 'Запрещенный никнейм' }
      }

      const getCurUser = await api.get.user({ filter: { id: `${data instanceof FormData ? data.get('id') : data.id}` }, limit: 1 })
      if (getCurUser.sef_code == sef_code) {
        return { error: 'У вас уже установлен данный никнейм' }
      }

      const getSefUsers = await api.get.user({ filter: { sef_code } })
      if (Array.isArray(getSefUsers) && getSefUsers.length > 0) {
        return { error: "Данный никнейм уже зарегистрирован" }
      }

      if (data instanceof FormData) {
        data.set('sef_code', sef_code);
      } else {
        data.sef_code = sef_code
      }
    }

    const res = await API.update.item(data);
    return res;
  },
  news: async function updateNews(fields) {
    if (fields instanceof FormData) {
      fields.append("table", "news");
    } else {
      fields.table = "news";
    }
    const res = await this.item(fields);
    return res;
  },
  cities: async function updateNews(fields) {
    if (fields instanceof FormData) {
      fields.append("table", "cities");
    } else {
      fields.table = "cities";
    }
    const res = await this.item(fields);
    return res;
  },
  areas: async function updateAreas(fields) {
    if (fields instanceof FormData) {
      fields.append("table", "areas");
    } else {
      fields.table = "areas";
    }
    const res = await api.update.item(fields);
    return res;
  },
  rcs: async function updateRcs(fields) {
    if (fields instanceof FormData) {
      fields.append("table", "rcs");
    } else {
      fields.table = "rcs";
    }

    const res = await api.update.item(fields);
    return res;
  },

  productViewCount: async function updateProductViewCount(product, window_host) {
    let getProduct = false;
    if(typeof product == 'object') {
      getProduct = await api.get.product.list({limit: 1, filter: {id: product.id}})
    } else {
      getProduct = await api.get.product.list({limit: 1, filter: {id: product}})
    }
    const updateCountFields = {
      id: getProduct.id,
      table: "product",
      stat_views: getProduct.stat_views ? parseInt(getProduct.stat_views + 1) : 1,
      date_change: "false",
      window_host: window_host
    };

    const data = await API.set.item(updateCountFields);
    if (data) {
      return data;
    }
  },

  productViewCountPreview: async function updateProductViewCount(product, window_host) {
    let getProduct = false;
    if(typeof product == 'object') {
      getProduct = await api.get.product.list({limit: 1, filter: {id: product.id}})
    } else {
      getProduct = await api.get.product.list({limit: 1, filter: {id: product}})
    }
    const updateCountFields = {
      id: getProduct.id,
      table: "product",
      stat_views_preview: getProduct.stat_views_preview ? Number(getProduct.stat_views_preview + 1) : 1,
      date_change: "false",
      window_host: window_host
    };

    const data = await API.set.item(updateCountFields);
    if (data) {
      return data;
    }
  },

  settings: async function updateSettings(fields, host) {
    const resFields = []
    if (fields instanceof FormData) {
      for (const pair of fields.entries()) {
        if (pair[0] == 'password') {
          const saltHash = generateSaltHash(pair[1])
          resFields.push({ name: 'master_password_token', value: saltHash.userToken })
          resFields.push({ name: 'master_password_salt', value: saltHash.salt })
        } else {
          resFields.push({ name: pair[0], value: pair[1] })
        }
      }
    } else {
      if (Array.isArray(fields)) {
        for (const prop in fields) {
          if (prop == 'password') {
            const saltHash = generateSaltHash(fields[property])
            resFields.push({ name: 'master_password_token', value: saltHash.userToken })
            resFields.push({ name: 'master_password_salt', value: saltHash.salt })
          } else {
            resFields.push({ name: prop, value: fields[prop] })
          }
        }
      } else if (typeof fields == 'object') {
        for (const property in fields) {
          if (property == 'password') {
            const saltHash = generateSaltHash(fields[property])
            resFields.push({ name: 'master_password_token', value: saltHash.userToken })
            resFields.push({ name: 'master_password_salt', value: saltHash.salt })
          } else {
            resFields.push({ name: property, value: fields[property] })
          }
        }
      }
    }

    return await Promise.all(
      resFields.map(async (field) => {
        const fieldInfo = await API.get.setting(field.name, false)

        if (!fieldInfo) {
          return { Error: `Не найдено настройки с именем ${field.name}` }
        }
        if (fieldInfo.value != field.value) {
          // return {fieldInfo, field}
          const updateSettingFields = {
            table: 'site_settings',
            id: fieldInfo.id,
            value: field.value,
            date_edited: new Date(),
          }
          if (host) {
            updateSettingFields.window_host = host
          }
          const res = await api.update.item(updateSettingFields);
          if (res?.data?.error) {
            return res.data.error;
          }
          return res.data
        }
      })
    )
  },

  banner: async function updateBanner(data) {
    if (data instanceof FormData) {
      data.append("table", "banners");
      if (!data.get('id')) {
        return { error: 'ID обязателен' }
      }
    } else {
      if (!data.id) {
        return { error: 'ID обязателен' }
      }
      data.table = "banners";
    }
    const res = await api.update.item(data);
    return res;
  },

  pushToken: async function updatePushToken(user, pushToken, window_host) {

    const userId = typeof user == 'object' ? user.id : user

    if(!userId) {
      return {Error: 'Пользователь обязателен'}
    }
    if(!pushToken) {
      return {Error: 'Токен обязателен'}
    }

    const tokenRow = await api.get.tokenRow(pushToken, window_host);

    if(!tokenRow.id) {
      return {Error: 'Не найден токен в базе'}
    }

    const data = {
      table: "push_tokens",
      id: tokenRow.id,
      user_id: userId
    }

    const res = await api.update.item(data)
    return res;
  }
};
