import axios from "axios";
import { dateDiffInMinutes } from "helpers/dateFunctions";
import { selectItems } from "lib/postgresql/db"
import api from "../service/api";
require('dotenv').config()

const domen = process.env.DOMEN

export default async (req, res) => {
    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }

        const week = new Date();
        // const halfMonth = new Date();
        const days30 = new Date();
        week.setDate(week.getDate() - 7);
        // halfMonth.setDate(halfMonth.getDate() - 15); // 15 days autoUndeploy
        days30.setDate(days30.getDate() - 30); // 30 days autoUnprem

        if (fields.type == 'hourly') {

            const unpremWeekFilter = { premium: '1', date_paid: { to: week } }
            const productsUnpremWeekCount = await api.get.product.count( unpremWeekFilter, domen )
            if (productsUnpremWeekCount?.count > 0) {
                const productsUnpremWeek = await api.get.product.list({ filter: unpremWeekFilter, window_host: domen })
                await api.update.productsByFilter(unpremWeekFilter, { premium: '0', date_paid: 'NULL', window_host: domen }, 'all')
                await createPersNotification(productsUnpremWeek, 'unprem');
            }

            const unpremMonthFilter = { premium: '2', date_paid: { to: days30 } }
            const productsUnpremMonthCount = await api.get.product.count(unpremMonthFilter, domen )
            if (productsUnpremMonthCount?.count > 0) {
                const productsUnpremMonth = await api.get.product.list({ filter: unpremMonthFilter, window_host: domen })
                await api.update.productsByFilter(unpremMonthFilter, { premium: '0', date_paid: 'NULL', window_host: domen }, 'all')
                await createPersNotification(productsUnpremMonth, 'unprem');
            }

        } else if (fields.type == 'daily') {
            const propertyItems = await api.get.data({table: 'property_values', limit: 'all'});
            propertyItems.map(async (propertyItem) => {
                const exists = await api.get.data({table: propertyItem.prop_value_table, filter: { id: propertyItem.prop_value_element }, limit: 1 })
                if (!exists || !propertyItem.prop_value_table || !propertyItem.prop_value_element && propertyItem.id) {
                    await api.remove.item({table: 'property_values', filter:{ id: propertyItem.id } })
                }
            })
        } else if (fields.type == 'minutely') {

            const unpublishFilter = { published: '1', premium: '0', date_published: { to: days30 } };
            const productsUnpublishCount = await api.get.product.count(unpublishFilter, domen )
            if (productsUnpublishCount?.count > 0) {
                const productsUnpublish = await api.get.product.list({ filter: unpublishFilter, window_host: domen })
                await api.update.productsByFilter(unpublishFilter, { published: 2, window_host: domen }, 'all')
                await createPersNotification(productsUnpublish, 'unpublish');
            }

            const isModerationOn = await api.get.setting('product_moderation')
            if (isModerationOn == 'N') {
                const getProdsUnpublished = await api.get.product.list({ filter: { published: '0' }, window_host: domen })
                const getNulls = await api.get.product.list({ filter: { published: 'null' }, window_host: domen })
                let getProds = []
                if (getProdsUnpublished?.length) {
                    getProds = getProds.concat(getProdsUnpublished)
                }
                if (getNulls?.length) {
                    getProds = getProds.concat(getNulls)
                }

                if (getProds && getProds?.length > 0) {
                    getProds.map(async (prod) => {
                        let diff = 0;
                        if(prod?.date_edited && new Date(prod.date_edited) - new Date(prod.date_created) > 0) {
                            diff = dateDiffInMinutes(prod.date_edited)
                        } else {
                            diff = dateDiffInMinutes(prod.date_created)
                        }
                        if (diff >= 5) {
                            await api.set.publishProduct(prod.id);
                            // await api.add.pushMessageByUser("Статус объявления изменился", `Ваше объявление ${prod.name} успешно прошло модерацию`, prod.user_id);
                        }
                    })
                }
            }

            const getSetting = await api.get.setting('register_moderation', false)
            if (dateDiffInMinutes(getSetting.date_edited) > 30 && getSetting.value != getSetting.default_value) {
                let updateObject = {};
                updateObject[getSetting.name] = getSetting.default_value
                await api.update.settings(updateObject, domen)
            }
        }

        res.status(200).json('response')
    } catch (Error) {
        res.status(200).json({ Error })
    }
}

async function createPersNotification(prods, template) {
    try {
        const arUProdNotifs = await Promise.all(prods.map(async (prod) => {
            return { user: prod.user_id, product_id: prod.id }
        }))

        await Promise.all(arUProdNotifs.map(async (arUProdNotif) => {
            await api.add.personalNotification({
                user_id: arUProdNotif.user.id,
                product_id: arUProdNotif.product_id,
                window_host: domen
            }, template)

        }))
    } catch ( Error ){
        console.log({Error, function: 'createPersNotification'})
    }
}