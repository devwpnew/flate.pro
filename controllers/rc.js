import { controllerError, filterToString, offsetToString, selectToString, sortToString } from "helpers/database"
import db from "lib/postgresql/db";
import productController from "./product"

const limitDefault = 20;

const rcController = {
    tableName: 'rcs',
    //dbFields = []

    getList: async ({sort, filter, limit, page, select}) => {
        const sortStr = sortToString(sort)

        const filterStr = filterToString(filter)

        if(limit && !Number(limit)) {
            throw new Error(`limit должен быть числом`)
        }
        const limitVar = limit ? limit : limitDefault;
        const limitStr = `LIMIT ${limitVar}`

        if(page && !Number(page)) {
            throw new Error(`page должен быть числом`)
        }
        const offsetStr = offsetToString(page, limitVar)

        const selectStr = selectToString(select)

        const query = `SELECT ${selectStr} FROM ${rcController.tableName} ${filterStr} ${sortStr} ${limitStr} ${offsetStr}`.trim()

        try {
            const request = await db.any(query)
            if(limitVar == 1){
                return request[0]
            }
            return request
        } catch (e) {
            return controllerError(e, {query})
        }
    },
    getByid: async ({id, select}) => {
        try {
            const getProd = await rcController.getList({sort: false, filter: {id}, limit: 1, page: false, select})
            return getProd
        } catch (e) {
            return controllerError(e, {id, select})
        }
    },
}
export default rcController;