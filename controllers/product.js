import { controllerError, filterToString, formatDateToDB, offsetToString, selectToString, sortToString } from "helpers/database";
import db from "lib/postgresql/db";
import propertyValuesController from "./property_values";
import usersController from "./users";

const limitDefault = 20;

function productFilter (newFilter) {
    const complicatedFilter = [];

    if(newFilter?.date_created) {
        newFilter.date_created = formatDateToDB(newFilter.date_created)
    }
    if(newFilter?.date_edited) {
        newFilter.date_edited = formatDateToDB(newFilter.date_edited)
    }
    if(newFilter?.date_published) {
        newFilter.date_published = formatDateToDB(newFilter.date_published)
    }
    if(newFilter?.date_sort) {
        newFilter.date_sort = formatDateToDB(newFilter.date_sort)
    }
    if(newFilter?.date_paid) {
        newFilter.date_paid = formatDateToDB(newFilter.date_banned_to)
    }
    if(newFilter?.date_banned_to) {
        newFilter.date_banned_to = formatDateToDB(newFilter.date_banned_to)
    }
    if(newFilter?.date_banned) {
        newFilter.date_banned = formatDateToDB(newFilter.date_banned)
    }
    // if(newFilter?.date_banned) {
    //     newFilter.date_banned = formatDateToDB(newFilter.date_banned)
    // }

    if(newFilter?.section_relation) {
        complicatedFilter.push(`'${newFilter.section_relation}' = ANY(section_relation)`);
        delete newFilter.section_relation;
    }

    // if(newFilter?.area_link) {
    //     complicatedFilter.push(`'${newFilter.section_relation}' = ANY(section_relation)`);
    //     delete newFilter.section_relation;
    // }

    if(newFilter?.user_agency_id) {
        complicatedFilter.push(`users.agency_id = ${newFilter.user_agency_id}`);
        delete newFilter.user_agency_id;
    }

    const defaultFilterStr = filterToString(newFilter)

    let productFilterRes = '';
    if(defaultFilterStr) {
        productFilterRes += defaultFilterStr
    }
    if(complicatedFilter.length) {
        if(defaultFilterStr) {
            productFilterRes += ' AND ';
        } else {
            productFilterRes += ' WHERE ';
        }
        productFilterRes += complicatedFilter.join(' AND ')
    }
    
    return productFilterRes
}

async function getMinMaxPrices(filter) {
    try {
        const filterStr = filterToString(filter)

        const getCount = `SELECT COUNT(*) FROM product ${filterStr} AND '3' = ANY(section_relation)`
        const requestCount = await db.any(getCount)
        const sectionCount = requestCount[0]?.count

        if (sectionCount == 1) {
            const queryPrice = `SELECT * FROM product ${filterStr} AND '3' = ANY(section_relation)`
            const requestPrice = await db.any(queryPrice)

            const minPrice = requestPrice[0]?.flats_price_for_m
            const maxPrice = minPrice
            const averageprice = maxPrice

            return { minPrice, maxPrice, averageprice }
        } else if (sectionCount == 2) {
            const queryMinPrice = `SELECT * FROM product ${filterStr} AND '3' = ANY(section_relation) ORDER BY flats_price_for_m ASC LIMIT 1`
            const queryMaxPrice = `SELECT * FROM product ${filterStr} AND '3' = ANY(section_relation) ORDER BY flats_price_for_m DESC LIMIT 1`

            const requsetMinPrice = await db.any(queryMinPrice)
            const requsetMaxPrice = await db.any(queryMaxPrice)

            const minPrice = requsetMinPrice[0]?.flats_price_for_m
            const maxPrice = requsetMaxPrice[0]?.flats_price_for_m
            const averageprice = (maxPrice + minPrice) / 2

            return { minPrice, maxPrice, averageprice }
        } else if (sectionCount > 2) {
            const center = sectionCount > 2 ? parseInt(sectionCount / 2) : 0;

            let limit = false;
            if (center % 2 == '1') {
                limit = 1;
            } else {
                limit = 2;
            }

            const queryMinPrice = `SELECT * FROM product ${filterStr} AND '3' = ANY(section_relation) ORDER BY flats_price_for_m ASC LIMIT 1`
            const queryMaxPrice = `SELECT * FROM product ${filterStr} AND '3' = ANY(section_relation) ORDER BY flats_price_for_m DESC LIMIT 1`

            const queryMedian = `SELECT * FROM product ${filterStr} AND '3' = ANY(section_relation) ORDER BY flats_price_for_m ASC LIMIT ${limit} OFFSET ${center}`

            const requsetMinPrice = await db.any(queryMinPrice)
            const requsetMaxPrice = await db.any(queryMaxPrice)
            const requsetMedian = await db.any(queryMedian)

            const minPrice = requsetMinPrice[0]?.flats_price_for_m
            const maxPrice = requsetMaxPrice[0]?.flats_price_for_m

            const averageprice = (limit == 1 ? (requsetMedian[0]?.flats_price_for_m) : ((requsetMedian[0]?.flats_price_for_m + requsetMedian[1]?.flats_price_for_m) / 2))

            return { minPrice, maxPrice, averageprice }
        }
        return false;
    } catch (e) {
        controllerError(e, { filter })
    }
}

async function parseProductAdditional(request) {
    const arReturn = await Promise.all(request.map(async (item) => {
        const props = await productController.getProperties({productId: item.id})
        if (Array.isArray(props)) {
            item.properties = {}
            props.map((property) => {
                item.properties[property.prop_code] = property.prop_value
            })
        }
        if(item?.user_id) {
            item.user_id = await usersController.getByid({id: item.user_id})
        }
        return item
    }))
    return arReturn
}

const productController = {
    tableName: 'product',

    getList: async ({ sort, filter, limit, page, select }) => {

        let limitVar = undefined;
        let limitStr = '';

        const selectStr = selectToString(select)

        let additionalSelect = '';
        if(filter?.user_agency_id) {
            additionalSelect = ` INNER JOIN users ON ${productController.tableName}.user_id = users.id `
        }
        
        const filterStr = productFilter(filter);

        // console.log({type: typeof limit})
        
        if (limit && limit != 'all' && !Number(limit)) {
            throw new Error(`limit должен быть числом`)
        } else if(limit != 'all') {
            limitVar = limit ? limit : limitDefault;
            limitStr = `LIMIT ${limitVar}`
        }
        
        if (page && !Number(page)) {
            throw new Error(`page должен быть числом`)
        }

        const sortStr = sortToString(sort)

        const offsetStr = offsetToString(page, limitVar)

        const query = `SELECT ${selectStr} FROM ${productController.tableName} ${additionalSelect} ${filterStr} ${sortStr} ${limitStr} ${offsetStr}`.trim()

        try {
            const request = await db.any(query)
            const arReturn = await parseProductAdditional(request)
            if (limitVar == 1) {
                return arReturn[0]
            }
            return arReturn
        } catch (e) {
            return controllerError(e, { query })
        }
    },

    getByid: async ({ id, select }) => {
        try {
            const getProd = await productController.getList({ sort: false, filter: { id }, limit: 1, page: false, select })
            return getProd
        } catch (e) {
            return controllerError(e, { id, select })
        }
    },
    getProperties: async ({ productId }) => {
        try {
            const properties = await propertyValuesController.getForItem({ table: productController.tableName, itemId: productId })
            return properties
        } catch (e) {
            controllerError(e, { productId })
        }
    },

    getStatistics: async ({ filter }) => {
        try {
            const arResults = [];
            const arFilters = [];

            if (filter?.living_squares?.from || filter?.living_squares?.to) {

                const lsFrom = filter?.living_squares?.from;
                const lsTo = filter?.living_squares?.to;

                if ((lsFrom || lsFrom === 0) && lsTo) {

                    arFilters[`${lsFrom}_${lsTo}`] = { ...filter }

                    arResults.push({
                        squares_from: lsFrom,
                        squares_to: lsTo,
                        name: `от ${lsFrom} до ${lsTo} м²`,
                        filter: arFilters[`${lsFrom}_${lsTo}`]
                    })
                } else if(lsFrom) {

                    if(lsFrom < 45) {

                        const thisFilterName = `${lsFrom}_45`

                        arFilters[thisFilterName] = { ...filter }

                        arFilters[thisFilterName].living_squares = {
                            from: lsFrom,
                            to: 45
                        }

                        arResults.push({
                            squares_from: lsFrom,
                            squares_to: 45,
                            name: `от ${lsFrom} до 45 м²`,
                            filter: arFilters[thisFilterName]
                        })
                    }

                    if(lsFrom < 60) {
                        const lsThisFrom = lsFrom > 45 ? lsFrom : '45'

                        const thisFilterName = `${lsThisFrom}_60`

                        arFilters[thisFilterName] = { ...filter }

                        arFilters[thisFilterName].living_squares = {
                            from: lsThisFrom,
                            to: 60
                        }

                        arResults.push({
                            squares_from: lsThisFrom,
                            squares_to: 60,
                            name: `от ${lsThisFrom} до 60 м²`,
                            filter: arFilters[thisFilterName]
                        })
                    }

                    if(lsFrom < 80) {
                        const lsThisFrom = lsFrom > 60 ? lsFrom : '60'
                        const thisFilterName = `${lsThisFrom}_80`

                        arFilters[thisFilterName] = { ...filter }

                        arFilters[thisFilterName].living_squares = {
                            from: lsThisFrom,
                            to: 80
                        }

                        arResults.push({
                            squares_from: lsThisFrom,
                            squares_to: 80,
                            name: `от ${lsThisFrom} до 80 м²`,
                            filter: arFilters[thisFilterName]
                        })
                    }

                    const lsFromLast = lsFrom > 80 ? lsFrom : 80
                    arFilters[`${lsFromLast}`] = { ...filter }

                    arFilters[`${lsFromLast}`].living_squares = {
                        from: lsFromLast
                    }

                    arResults.push({
                        squares_from: lsFromLast,
                        name: `от ${lsFromLast} м²`,
                        filter: arFilters[`${lsFromLast}`]
                    })

                } else if(lsTo) {

                    const lsToStart = lsTo < 45 ? lsTo : 45
                    const thisFilterName = `0_${lsToStart}`

                    arFilters[thisFilterName] = { ...filter }

                    arFilters[thisFilterName].living_squares = {
                        from: 0,
                        to: lsToStart
                    }

                    arResults.push({
                        squares_from: 0,
                        squares_to: lsToStart,
                        name: `от 0 до ${lsToStart} м²`,
                        filter: arFilters[thisFilterName]
                    })

                    if(lsTo > 45) {
                        const lsThisTo = lsTo < 60 ? lsTo : 60;
                        const thisFilterName = `45_${lsThisTo}`

                        arFilters[thisFilterName] = { ...filter }

                        arFilters[thisFilterName].living_squares = {
                            from: 45,
                            to: lsThisTo
                        }

                        arResults.push({
                            squares_from: 45,
                            squares_to: lsThisTo,
                            name: `от 45 до ${lsThisTo} м²`,
                            filter: arFilters[thisFilterName]
                        })
                    }

                    if(lsTo > 60) {
                        const lsThisTo = lsTo < 80 ? lsTo : 80;
                        const thisFilterName = `60_${lsThisTo}`

                        arFilters[thisFilterName] = { ...filter }

                        arFilters[thisFilterName].living_squares = {
                            from: 60,
                            to: lsThisTo
                        }

                        arResults.push({
                            squares_from: 60,
                            squares_to: lsThisTo,
                            name: `от 60 до ${lsThisTo} м²`,
                            filter: arFilters[thisFilterName]
                        })
                    }

                    if(lsTo > 80) {
                        const lsThisTo = lsTo;
                        const thisFilterName = `80_${lsThisTo}`

                        arFilters[thisFilterName] = { ...filter }

                        arFilters[thisFilterName].living_squares = {
                            from: 80,
                            to: lsThisTo
                        }

                        arResults.push({
                            squares_from: 80,
                            squares_to: lsThisTo,
                            name: `от 80 до ${lsThisTo} м²`,
                            filter: arFilters[thisFilterName]
                        })
                    }
                }
            } else {

                arFilters['0_45'] = { ...filter }
                arFilters['45_60'] = { ...filter }
                arFilters['60_80'] = { ...filter }
                arFilters['80'] = { ...filter }

                arFilters['0_45'].living_squares = {
                    from: 0,
                    to: 45
                }

                arFilters['45_60'].living_squares = {
                    from: 45,
                    to: 60
                }

                arFilters['60_80'].living_squares = {
                    from: 60,
                    to: 80
                }

                arFilters['80'].living_squares = {
                    from: 80
                }

                arResults.push({ squares_from: 0, squares_to: 45, name: '1к 0-45 м²', filter: arFilters['0_45'] })
                arResults.push({ squares_from: 45, squares_to: 60, name: '2к 45-60 м²', filter: arFilters['45_60'] })
                arResults.push({ squares_from: 60, squares_to: 80, name: '3к 60-80 м²', filter: arFilters['60_80'] })
                arResults.push({ squares_from: 80, name: 'от 80 м²', filter: arFilters['80'] })
            }

            arResults.map((res) => {
                res.filter.published = '1'
                res.filter.flats_price_for_m = '!NULL'
                delete res.filter.section_relation
            })

            const responses = await Promise.all(arResults.map(async (result) => {
                return {
                    ...result,
                    data: await getMinMaxPrices(result.filter)
                }
            }))

            let avgSum = 0;
            let countSums = 0;

            responses.map((res) => {
                avgSum += res?.data?.averageprice;
                countSums += 1;
            })

            if (countSums) {
                responses.average = avgSum / countSums
            }

            return responses
        } catch (e) {
            controllerError(e, { filter })
        }
    },

    getCount: async ({ filter }) => {
        let additionalSelect = '';
        if(filter?.user_agency_id) {
            additionalSelect = ` INNER JOIN users ON ${productController.tableName}.user_id = users.id `
        }

        const filterStr = productFilter(filter);
        // console.log({filterStr})

        const query = `SELECT COUNT(*) FROM ${productController.tableName} ${additionalSelect} ${filterStr}`.trim()

        // console.log({countQuery: query})

        try {
            const request = await db.one(query)
            // console.log({countRequest: request})
            return request
        } catch (e) {
            return controllerError(e, { query })
        }
    }
}
export default productController;