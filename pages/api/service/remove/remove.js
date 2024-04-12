import axios from "axios";

import API from "../api";

let domen = false;

let REMOVE = {};
export default REMOVE = {
  item: async function removeItem(fields) {
    if (fields.window_host) {
      domen = fields.window_host;
    } else if (typeof window != 'undefined') {
      domen = window.location.origin;
    }

    const res = await axios.post(
      `${domen ? domen : "https://flate.pro"}/api/admin_api/delete`,
      fields
    );

    if (res.data.error) {
      throw { error: res.data.error };
    }
    const data = res.data;

    return data;
  },

  productByFilter: async function removeProductByFilter(filter) {
    const removeFields = {
      table: "product",
      filter: filter,
    };

    const getProducts = await API.get.product.list(removeFields)

    let removeIds = [];

    if (Array.isArray(getProducts)) {
      getProducts.forEach((prod) => {
        removeIds.push(prod.id)
      })
    } else {
      removeIds = getProducts.id
    }
    const resRemove = await Promise.all(removeIds.map(async (removeId) => {
      return await API.remove.product(removeId)
    }))
    return resRemove
  },

  product: async function removeProduct(id) {
    const resId = Number(id);

    if(!resId) {
      return {error: 'ID обязателен для удаления'}
    }

    if(typeof resId != 'number') {
      return {error: 'ID не является числом'}
    }

    const removeFields = {
      table: "product",
      filter: {id: resId},
    }

    const isExist = await API.get.product.list({...removeFields, ...{limit: 1}})
    if(!isExist || isExist.id != resId) {
      return {error: 'Не найден элемент для удаления'}
    }

    const data = await API.remove.item(removeFields);
    if (data) {
      API.remove.deletedItemsProps('product', id)
    }
    return data;
  },
  user: async function removeUser(filter) {
    const removeFields = {
      table: "users",
      filter: filter,
    };

    const getUser = await API.get.user(removeFields);

    let removeIds = [];

    if (Array.isArray(getUser)) {
      getUser.forEach((user) => {
        removeIds.push(user.id)
      })
    } else {
      removeIds = getUser.id
    }

    const data = await API.remove.item(removeFields);

    if (data) {

      const removeProdsLinked = {
        table: "product",
        filter: { user_id: removeIds },
      };
      await API.remove.item(removeProdsLinked)

      return data;
    }
  },
  news: async function removeNews(filter) {
    const removeFields = {
      table: "news",
      filter: filter,
    };
    const data = await API.remove.item(removeFields);
    if (data) {
      return data;
    }
  },
  cities: async function removeCities(cityId) {
    if (!cityId) {
      return { Error: 'ID города обязателен' }
    }
    const removeFields = {
      table: "cities",
      filter: { id: cityId },
    };

    const data = await API.remove.item(removeFields);
    if (data) {
      const removeAreasLinkedFields = {
        table: "areas",
        filter: {
          link_city: cityId
        }
      }
      await API.remove.item(removeAreasLinkedFields)

      const removeRcsLinkedFields = {
        table: "rcs",
        filter: {
          city_link: cityId
        }
      }
      await API.remove.item(removeRcsLinkedFields)

      return data;
    }
  },
  areas: async function removeAreas(areaId) {
    if (!areaId) {
      return { Error: 'ID города обязателен' }
    }

    const removeFields = {
      table: "areas",
      filter: { id: areaId },
    };

    // remove areas childrens by this.id = child."parent_area"

    const data = await API.remove.item(removeFields);
    if (data) {
      await API.remove.item({
        table: "areas",
        filter: { parent_area: areaId }
      })
      return data;
    }
  },
  rcs: async function removeRcs(rcId) {
    if (!rcId) {
      return { Error: 'ID ЖК обязателен' }
    }
    const removeFields = {
      table: "rcs",
      filter: { id: rcId },
    };
    const data = await API.remove.item(removeFields);
    if (data) {
      await API.update.productsByFilter({ rc_link: rcId }, { rc_link: 'NULL' });
      return data;
    }
  },
  favoritesById: async function removeFavoritesById(user_id, removeFavorites) {
    const user = await API.get.user({ filter: { id: user_id }, limit: 1 });

    if (!user) {
      return { error: "User Обязателен" };
    }

    if (!Array.isArray(removeFavorites)) {
      removeFavorites = [removeFavorites];
    }
    let resultFavorites = [];
    if (user.favorites) {
      if (Array.isArray(user.favorites)) {
        user.favorites.map((userFavorite) => {
          if (userFavorite && userFavorite.id) {
            resultFavorites.push(userFavorite.id); // преобразуем объект с товарами в массив айдишников
          }
        });

        removeFavorites.map((removeFavorite) => {
          const index = resultFavorites.indexOf(removeFavorite); // если нашёл в массиве юзера то убирает
          if (index !== -1) {
            resultFavorites.splice(index, 1);
          }
        });
      }
    }

    // if (resultFavorites) {
    const removeFavoritesFields = {
      table: "users",
      id: user.id,
      favorites: resultFavorites[0] ? resultFavorites : null,
    };

    const data = await API.set.item(removeFavoritesFields);

    if (data) {
      return data;
    }
    // }
  },
  favorites: async function removeFavorites(req, res, removeFavorites) {
    let user;
    if ((user = await API.auth.isUserAuthorized(req, res))) {
      const data = await this.favoritesById(user, removeFavorites);

      if (data) {
        return data;
      }
    } else {
      return { error: "Неавторизованный пользователь или не указан ID" };
    }
  },

  messageById: async function removeMessageByID(messageId) {
    if (!messageId) {
      return { Error: 'ID сообщения обязателен' }
    }

    const removeFields = {
      table: "messages",
      filter: { id: messageId },
    };

    // remove areas childrens by this.id = child."parent_area"

    const data = await API.remove.item(removeFields);
    return data
  },

  notification: async function removeNotification(notificationId, filter = false) {
    if (!notificationId && ( !filter && Object.keys(filter).length > 0 )) {
      return { Error: 'ID уведомления или фильтр обязателен' }
    }

    const removeFields = {
      table: "personal_notifications",
      filter: filter ? filter : { id: notificationId },
    };

    // console.log('removeFields', removeFields)

    // return false;
    const data = await API.remove.item(removeFields);
    return data
  },

  deletedItemsProps: async function removeDeletedItemsProps(table, itemId) {
    if (!itemId) {
      return { error: 'Item ID обязателен' }
    } if (!table) {
      return { error: 'Таблица обязательна' }
    }
    const removeFields = {
      table: 'property_values',
      filter: {
        prop_value_element: itemId,
        prop_value_table: table
      }
    }
    return await API.remove.item(removeFields)
  },

  userAdditionalPhone: async function removeUserAdditionalPhone(phone, user = undefined) {
    if(!phone){
      return {error: 'Не указан номер телефона'}
    }
    if (user == undefined) {
      user = await API.get.user({
        filter: {
          logicOr: {
            phone: phone,
            additional_phones: phone
          }
        },
        limit: 1
      })
    }
    if(!user){
      return {error: "Не удалось получить пользователя"}
    }
    const userId = typeof user == 'object' ? user.id : user
    const arUser = await API.get.user({ filter: { id: userId }, limit: 1 })
    
    const arrPhones = arUser.additional_phones
    if(!arrPhones.includes(phone)){
      return {error: 'Телефон не привязан к данному пользователю'}
    }

    const newPhones = [];

    arrPhones.forEach((arPhone) => {
      if(arPhone != phone){
        newPhones.push(arPhone)
      }
    })

    const updateUserFields = {
      table: 'users',
      id: arUser.id,
      additional_phones: newPhones
    }

    // console.log('updateUserFields', updateUserFields)

    const updateUser = await API.update.user(updateUserFields)
    // console.log('updateUser', updateUser)
  },
  tasks: async (filter) => {
    const removeFields = {
      table: "tasks",
      filter: filter,
    };
    const data = await API.remove.item(removeFields);
    if (data) {
      return data;
    }
  },
  reports: async (filter) => {
    const removeFields = {
      table: "reports",
      filter: filter,
    };
    const data = await API.remove.item(removeFields);
    if (data) {
      return data;
    }
  },
};
