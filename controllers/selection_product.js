import { arrayToDatabase, controllerError, filterToString, formatDateToDB, offsetToString, oldPicturesToDb, selectToString, sortToString } from "helpers/database";
import db from "lib/postgresql/db";
import productController from "./product"
import selectionsController from "./selections";
import api from "pages/api/service/api";

const limitDefault = 20

const selectionProductController = {
    maxCountForSelection: 20,
    tableName: 'selection_product',

    dbFields: ['name', 'preview_image', 'preview_old', 'gallery', 'gallery_old', 'address', 'price', 'price_for_measure', 'comission', 'product_id', 'rc', 'sort', 'type', 'floor', 'floor_count', 'selection', 'rooms_count', 'square', 'square_area', 'square_object', 'repair', 'construction', 'communication', 'status', 'status_lands'],

    get: async ({ sort, filter, limit, page, select }) => {

        const sortStr = sortToString(sort)

        const filterStr = filterToString(filter)

        if (limit && limit != 'all' && !Number(limit)) {
            throw new Error(`limit должен быть числом`)
        }
        const limitVar = limit ? limit : (limitDefault ? limitDefault : false);
        const limitStr = limitVar != 'all' ? `LIMIT ${limitVar}` : ''

        if (page && !Number(page)) {
            throw new Error(`page должен быть числом`)
        }
        const offsetStr = offsetToString(page, limitVar)

        const selectStr = selectToString(select)

        const query = `SELECT ${selectStr} FROM ${selectionProductController.tableName} ${filterStr} ${sortStr} ${limitStr} ${offsetStr}`.trim()

        try {
            const request = await db.any(query)
            if (limitVar == 1) {
                return request[0]
            }
            return request
        } catch (e) {
            return controllerError(e, { function: 'get', query })
        }
    },

    getList: async ({ sort, filter, limit, page, select }) => {
        try {
            const res = await selectionProductController.get({ sort, filter, limit, page, select })
            return res
        } catch (e) {
            return controllerError(e, { function: 'getList', sort, filter, limit, page, select })
        }
    },

    getById: async ({ id, select }) => {
        try {
            return await selectionProductController.get({ filter: { id }, select, sort: false, limit: 1 })
        } catch (e) {
            return controllerError(e, { function: 'getById', id })
        }
    },
    parseValues: (fields, type = 'EDIT') => {
        const arValues = [];

        if (type == 'EDIT') {
            selectionProductController.dbFields.map((fieldName) => {
                if (fields[fieldName]) {
                    arValues.push(`${fieldName} = '${fields[fieldName]}'`)
                }
            })
        } else if (type == 'ADD') {
            arValues.push(`'${fields.name}'`)
            arValues.push(fields.preview_image ? fields.preview_image : 'NULL')
            arValues.push(fields.preview_old ? `'${fields.preview_old}'` : 'NULL')
            arValues.push(fields.gallery ? arrayToDatabase(fields.gallery) : 'NULL')
            arValues.push(fields.gallery_old ? arrayToDatabase(JSON.parse(fields.gallery_old)) : 'NULL')
            arValues.push(fields.address ? `'${fields.address}'` : 'NULL')
            arValues.push(fields.price ? fields.price : 'NULL')
            arValues.push(fields.price_for_measure ? fields.price_for_measure : 'NULL')
            arValues.push(fields.comission ? fields.comission : 'NULL')
            arValues.push(fields.product_id)
            arValues.push(fields.rc ? fields.rc : 'NULL')
            arValues.push(fields.sort ? fields.sort : 'NULL')
            arValues.push(fields.type ? fields.type : 'NULL')
            arValues.push(fields.floor ? fields.floor : 'NULL')
            arValues.push(fields.floor_count ? fields.floor_count : 'NULL')
            arValues.push(fields.selection)

            arValues.push(fields.rooms_count ? fields.rooms_count : 'NULL')

            arValues.push(fields.square ? fields.square : 'NULL')
            arValues.push(fields.square_area ? fields.square_area : 'NULL')
            arValues.push(fields.square_object ? fields.square_object : 'NULL')

            arValues.push(fields.repair ? `'${fields.repair}'` : 'NULL')
            arValues.push(fields.construction ? `'${fields.construction}'` : 'NULL')
            arValues.push(fields.communication ? `'${fields.communication}'` : 'NULL')
            arValues.push(fields.status ? `'${fields.status}'` : 'NULL')
            arValues.push(fields.status_lands ? `'${fields.status_lands}'` : 'NULL')
        }

        return arValues.join(', ')
    },

    add: async ({ fields, select }) => {

        if (!fields.selection) {
            throw new Error('ID подборки (fields.selection) обязателен')
        }
        if (!fields.name) {
            throw new Error('Название (fields.name) подборки обязательно')
        }
        if (!fields.product_id) {
            throw new Error('ID оригинального объекта (fields.product_id) обязательно')
        }

        const getUserSelectionItemCount = await selectionProductController.count({ filter: { selection: fields.selection } })
        // console.log(getUserSelectionItemCount.count, selectionProductController.maxCountForSelection)
        if (getUserSelectionItemCount?.count && Number(getUserSelectionItemCount.count) >= Number(selectionProductController.maxCountForSelection)) {
            throw new Error('Превышено максимальное количество объектов в подборке')
        }

        if (!fields.sort) {
            const getMaxSort = await db.any(`SELECT id, sort, selection FROM ${selectionProductController.tableName} WHERE selection = '${fields.selection}' ORDER BY sort DESC LIMIT 1`)
            const maxSort = getMaxSort[0]
            // console.log({maxSort})
            fields.sort = maxSort?.sort ? maxSort.sort + 1 : 1;
            // console.log(fields.sort)
        }

        const strValues = selectionProductController.parseValues(fields, 'ADD')

        const selectStr = selectToString(select)

        const query = `INSERT INTO ${selectionProductController.tableName} (${selectionProductController.dbFields}) VALUES (${strValues}) RETURNING ${selectStr}`

        try {
            const request = await db.any(query)
            if (Array.isArray(request) && request.length == 1) {
                return request[0]
            }
            return request
        } catch (e) {
            return controllerError(e, { function: 'add', query })
        }
    },

    copyProduct: async ({ productId, selectionId }) => {
        const prodInfo = await productController.getByid({ id: productId })
        if (!prodInfo) {
            throw new Error(`Обэект ${productId} не найден`)
        }
        const selectionInfo = await selectionsController.getById({ id: selectionId })
        if (!selectionInfo) {
            throw new Error(`Подборки с id = ${selectionId} не существует`)
        }
        const properties = await productController.getProperties({ productId })
        prodInfo.properties = {}
        if (Array.isArray(properties)) {
            properties.map((prop) => prodInfo.properties[prop.prop_code] = prop.prop_value)
        }
        const typeResult = prodInfo.section_relation[0];
        // let resSquare = null;
        // if (typeResult == 3) {
        //     resSquare = prodInfo?.living_squares
        // } else if (typeResult == 4 || typeResult == 5) {
        //     resSquare = prodInfo?.land_squares
        // } else if (typeResult == 6 || typeResult == 7) {
        //     resSquare = prodInfo?.object_squares
        // }
        // let image = false;
        // if (prodInfo?.image_v2) {
        //     image = prodInfo?.image_v2
        // } else if (prodInfo?.image) {
        //     image = prodInfo.image
        // }

        // console.log({prodInfo})

        // const propsSelects = [
        //     {code: 'repairment'},
        //     {code: 'house_construction'},
        //     {code: 'house_communication'}
        // ]

        // const propsSelectsValues = await api.get.product.fieldPrintableValue('repairment', prodInfo['repairment'])

        // console.log({propsSelectsValues})

        const newProdFields = {
            name: prodInfo.name,
            preview_image: prodInfo.image_v2,
            preview_old: prodInfo.image,
            gallery: prodInfo.gallery_v2,
            gallery_old: prodInfo?.properties?.product_galery,
            address: prodInfo?.properties?.product_address,
            price: prodInfo.product_price,
            product_id: productId,
            rc: prodInfo.rc_link,
            // sort: 1,
            type: typeResult,
            floor: prodInfo?.properties?.product_floor,
            floor_count: (prodInfo?.house_floors ? prodInfo.house_floors : (prodInfo?.flat_floors && prodInfo.flat_floors)),
            selection: selectionId,
            rooms_count: prodInfo.product_room_count,
            
            square: prodInfo?.living_squares,
            square_area: prodInfo?.land_squares,
            square_object: prodInfo?.object_squares,

            repair: prodInfo['repairment'] ? await api.get.product.fieldPrintableValue('repairment', prodInfo['repairment']) : '',
            construction: prodInfo['house_construction'] ? await api.get.product.fieldPrintableValue('house_construction', prodInfo['house_construction']) : '',
            communication: prodInfo['house_communication'] ? await api.get.product.fieldPrintableValue('house_communication', prodInfo['house_communication']) : '',
            status: prodInfo['status'] ? await api.get.product.fieldPrintableValue('status', prodInfo['status']) : '',
            status_lands: prodInfo['status_lands'] ? await api.get.product.fieldPrintableValue('status_lands', prodInfo['status_lands']) : '',
        }

        // console.log({newProdFields})

        const selectionProduct = await selectionProductController.add({ fields: newProdFields, select: ['id'] })
        return selectionProduct
    },

    editItems: async ({ filter, fields, select }) => {
        if (!fields) {
            throw new Error('Поля для обновления пусты')
        }

        const filterStr = filterToString(filter)

        fields.date_edited = formatDateToDB(new Date());
        const strValues = selectionProductController.parseValues(fields, 'EDIT')

        const selectStr = selectToString(select, 'EDIT')

        const query = `UPDATE ${selectionProductController.tableName} SET ${strValues} ${filterStr} ${selectStr}`

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
            const res = await selectionProductController.editItems({ filter: { id }, fields, select })
            return res
        } catch (e) {
            return controllerError(e, { function: 'selectionController.editById', fields, id })
        }
    },

    updateSort: async ({ selectionProducts }) => {
        if (!selectionProducts) {
            throw new Error('Список подборок обязателен')
        }
        if (!Array.isArray(selectionProducts)) {
            throw new Error('Подборки (selectionProducts) должны быть массивом объектов. Примеры: [{id:1,sort:1},{id:333,sort:2}} или [1,333,555,777]')
        }

        const arResultSelectionProds = selectionProducts.map((selectionProd) => {
            return selectionProd?.id ? selectionProd.id : selectionProd
        })

        try {
            const results = await Promise.all(arResultSelectionProds.map(async (selectionProdId, index) => {
                return await selectionProductController.editById({ id: selectionProdId, fields: { sort: index + 1 }, select: ['id', 'sort'] })
            }))
            return results
        } catch (e) {
            return controllerError(e, { function: 'selectionController.updateSort', selectionProducts })
        }
    },

    addProductToSelection: async ({ productId, selectionId }) => {
        try {
            if(!productId) {
                throw new Error('id объекта обязателен')
            }
            if(!selectionId) {
                throw new Error('id Подборки обязателен')
            }
            console.log({productId, selectionId})
            const newProd = await selectionProductController.copyProduct({ productId, selectionId })
            return newProd
        } catch (e) {
            return controllerError(e, { function: 'selectionController.addproductToSelection', productId, selectionId })
        }
    },

    remove: async ({ filter, select }) => {
        const filterStr = filterToString(filter)

        try {
            return db.any(`DELETE FROM ${selectionProductController.tableName} ${filterStr}`)
        } catch (e) {
            return controllerError(e, { function: 'selectionController.removeById', id, select })
        }
    },

    removeById: async ({ id, select }) => {
        try {
            return db.any(`DELETE FROM ${selectionProductController.tableName} WHERE id = ${id}`)
        } catch (e) {
            return controllerError(e, { function: 'selectionController.removeById', id, select })
        }
    },

    count: async ({ filter }) => {
        const filterStr = filterToString(filter)
        try {
            const res = db.one(`SELECT COUNT(*) FROM ${selectionProductController.tableName} ${filterStr}`)
            return res
        } catch (e) {
            return controllerError(e, { function: 'selectionController..count', query })
        }
    },
}

export default selectionProductController;