import { controllerError, filterToString, formatDateToDB, offsetToString, selectToString, sortToString } from "helpers/database";
import db from "lib/postgresql/db";

require('dotenv').config()

const limitDefault = 50;

const sectionsController = {
    tableName: "sections",
    limitDefault: '5',

    get: async ({ sort, filter, limit, page, select }) => {

        const sortStr = sortToString(sort)

        const filterStr = filterToString(filter)

        if (limit && limit != 'all' && !Number(limit)) {
            throw new Error(`limit должен быть числом`)
        }
        const limitVar = limit ? limit : limitDefault;
        const limitStr = `LIMIT ${limitVar}`

        if (page && !Number(page)) {
            throw new Error(`page должен быть числом`)
        }
        const offsetStr = offsetToString(page, limitVar)

        const selectStr = selectToString(select)

        const query = `SELECT ${selectStr} FROM ${sectionsController.tableName} ${filterStr} ${sortStr} ${limitStr} ${offsetStr}`.trim()

        try {
            const request = await db.any(query)
            if (limitVar == 1) {
                return request[0]
            }
            return request
        } catch (e) {
            return controllerError(e, { function: 'selectionController.get', query })
        }
    },

    getList: async ({ sort, filter, limit, page, select }) => {
        try {
            const res = await sectionsController.get({ sort, filter, limit, page, select })
            return res
        } catch (e) {
            return controllerError(e, { function: 'selectionController.getList', sort, filter, limit, page, select })
        }
    },

    getById: async ({ id, select }) => {
        try {
            return await sectionsController.get({ filter: { id }, select, sort: false, limit: 1 })
        } catch (e) {
            return controllerError(e, { function: 'selectionController.getById', id })
        }
    }
}

export default sectionsController;