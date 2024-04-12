import { controllerError, filterToString, formatDateToDB, offsetToString, selectToString, sortToString } from "helpers/database";
import db from "lib/postgresql/db";

require('dotenv').config()

const limitDefault = 50;

const selectionsController = {
    maxCountForUser: 50,
    tableName: "selections",
    dbFields: ['name', 'user_id', 'title', 'description', 'postscriptum', 'phone', 'date_created', 'date_edited', 'sort'],

    parseValues: (fields, type = 'EDIT') => {
        const arValues = [];

        if (type == 'EDIT') {
            selectionsController.dbFields.map((fieldName) => {
                if (fields[fieldName]) {
                    arValues.push(`${fieldName} = '${fields[fieldName]}'`)
                }
            })
        } else if (type == 'ADD') {
            arValues.push(`'${fields.name}'`)
            arValues.push(fields.user_id),
                arValues.push(fields.title ? `'${fields.title}'` : 'NULL'),
                arValues.push(fields.description ? `'${fields.description}'` : 'NULL'),
                arValues.push(fields.postscriptum ? `'${fields.postscriptum}'` : 'NULL'),
                arValues.push(fields.phone ? `'${fields.phone}'` : 'NULL'),
                arValues.push(`'${formatDateToDB(new Date())}'`),
                arValues.push(`'${formatDateToDB(new Date())}'`),
                arValues.push(fields.sort ? fields.sort : 'NULL');
        }

        return arValues.join(', ')
    },

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

        const query = `SELECT ${selectStr} FROM ${selectionsController.tableName} ${filterStr} ${sortStr} ${limitStr} ${offsetStr}`.trim()

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
            const res = await selectionsController.get({ sort, filter, limit, page, select })
            return res
        } catch (e) {
            return controllerError(e, { function: 'selectionController.getList', sort, filter, limit, page, select })
        }
    },

    getById: async ({ id, select }) => {
        try {
            return await selectionsController.get({ filter: { id }, select, sort: false, limit: 1 })
        } catch (e) {
            return controllerError(e, { function: 'selectionController.getById', id })
        }
    },

    add: async ({ fields, select }) => {

        if (!fields?.name) {
            throw new Error('Название подборки обязательно')
        }
        if (!fields?.user_id) {
            throw new Error('Владелец подборки обязателен')
        }
        // if (!fields?.title) {
        //     throw new Error('Заголовок подборки обязателен')
        // }

        const getUserSelectionCount = await selectionsController.count({ filter: { user_id: fields.user_id } })
        if (getUserSelectionCount?.count && getUserSelectionCount.count >= selectionsController.maxCountForUser) {
            throw new Error('Превышено максимальное количество подборок')
        }

        if(!fields.sort) {
            const getMaxSort = await db.any(`SELECT id, sort, user_id FROM ${selectionsController.tableName} WHERE user_id = '${fields.user_id}' ORDER BY sort DESC LIMIT 1`)
            // console.log({maxSort})
            const maxSort = getMaxSort[0]
            fields.sort = maxSort?.sort ? maxSort.sort + 1 : 1;
            // console.log('fields.sort', fields.sort)
        }

        const strValues = selectionsController.parseValues(fields, 'ADD')

        const selectStr = selectToString(select)

        const query = `INSERT INTO ${selectionsController.tableName} (${selectionsController.dbFields}) VALUES (${strValues}) RETURNING ${selectStr}`

        try {
            const request = await db.any(query)
            if (Array.isArray(request) && request.length == 1) {
                return request[0]
            }
            return request
        } catch (e) {
            return controllerError(e, { function: 'selectionController.add', query })
        }
    },

    editItems: async ({ filter, fields, select }) => {
        if (!fields) {
            throw new Error('Поля для обновления пусты')
        }

        const filterStr = filterToString(filter)

        fields.date_edited = formatDateToDB(new Date());
        const strValues = selectionsController.parseValues(fields, 'EDIT')

        const selectStr = selectToString(select, 'EDIT')

        const query = `UPDATE ${selectionsController.tableName} SET ${strValues} ${filterStr} ${selectStr}`

        try {
            const request = await db.any(query)
            if (Array.isArray(request) && request.length == 1) {
                return request[0]
            }
            return request
        } catch (e) {
            return controllerError(e, { function: 'selectionController.edtItems', query })
        }
    },

    editById: async ({ id, fields, select }) => {
        try {
            if (!id) {
                throw new Error('id подборки обязателен')
            }
            const res = await selectionsController.editItems({ filter: { id }, fields, select })
            return res
        } catch (e) {
            return controllerError(e, { function: 'selectionController.editById', fields, id })
        }
    },

    updateSort: async ({ selections }) => {
        if (!selections) {
            throw new Error('Список подборок обязателен')
        }
        if (!Array.isArray(selections)) {
            throw new Error('Подборки (selections) должны быть массивом объектов. Примеры: [{id:1,sort:1},{id:333,sort:2}} или [1,333,555,777]')
        }

        // const arResultSelections = selections.map((selection) => {
        //     return selection?.id ? selection.id : selection
        // })

        try {
            const results = await Promise.all(selections.map(async (selection, index) => {
                return await selectionsController.editById({
                    id: selection?.id ? selection.id : selection,
                    fields: {
                        sort: selection?.sort ? selection.sort : index + 1
                    },
                    select: ['id', 'sort']
                })
            }))
            return results
        } catch (e) {
            return controllerError(e, { function: 'selectionController.updateSort', selections })
        }
    },

    count: async ({ filter }) => {
        const filterStr = filterToString(filter)
        try {
            const res = db.one(`SELECT COUNT(*) FROM ${selectionsController.tableName} ${filterStr}`)
            return res
        } catch (e) {
            return controllerError(e, { function: 'selectionController..count', query })
        }
    },

    countForUser: async ({ user_id }) => {
        if (!user_id) {
            return { error: 'user_id Обязателен' }
        }
        try {
            return await selectionsController.count({ filter: { user_id } })
        } catch (e) {
            return controllerError(e, { function: 'selectionController.countForUser', user_id })
        }
    },

    remove: async ({ filter }) => {
        const filterStr = filterToString(filter)

        try {
            return db.any(`DELETE FROM ${selectionsController.tableName} ${filterStr}`)
        } catch (e) {
            return controllerError(e, { function: 'selectionController.removeById', id, select })
        }
    },

    removeById: async ({ id }) => {
        try {
            // return `DELETE FROM ${selectionsController.tableName} WHERE id = ${id}`
            return db.any(`DELETE FROM ${selectionsController.tableName} WHERE id = ${id}`)
        } catch (e) {
            return controllerError(e, { function: 'selectionController.removeById', id, select })
        }
    }
}

export default selectionsController;