// import { unlink } from 'fs/promises';

const pgp = require('pg-promise')({
    noWarnings: true
})

require('dotenv').config()

const user = process.env.POSTGRESQL_USER;
const password = process.env.POSTGRESQL_PASSWORD;
const host = process.env.POSTGRESQL_HOST;
const port = process.env.POSTGRESQL_PORT;
const db_name = process.env.POSTGRESQL_DBNAME;

const db = pgp(`postgresql://${user}:${password}@${host}:${port}/${db_name}`)

export default db

export async function getColumn(table, columnName) {
    try {
        if (!table) {
            return {
                error: "Таблица должна быть указана"
            };
        }
        if (!columnName) {
            return {
                error: "Колонка должна быть указана"
            };
        }
        let column = await db.any(`SELECT * FROM information_schema.columns WHERE table_name = '${table}' AND column_name = '${columnName}'`)
        let resColumn = column[0]
        if (resColumn) {
            const get_column_desc = await db.any(`SELECT * FROM fields_description WHERE "table" = '${table}' AND field_code = '${columnName}'`)
            const column_desc = get_column_desc[0]
            if (column_desc) {
                if (column_desc.field_type == 'select' || column_desc.field_type == 'multiple-select') {
                    const jsonOptions = JSON.parse(column_desc.options)
                    const resultOptions = []
                    for (let keyFrom in jsonOptions) {
                        if (keyFrom == 'from_database') {
                            const splitSelect = jsonOptions[keyFrom].split('.')
                            const table = splitSelect[0]
                            const field = splitSelect[1]

                            if (field == 'elements') {
                                const options = await db.any(`SELECT * FROM ${table}`)
                                if (options.error) {
                                    console.error('options', options)
                                }
                                options.forEach((option) => {
                                    resultOptions.push(option)
                                })
                            }

                        } else if (keyFrom == 'values') {
                            jsonOptions[keyFrom].forEach((option) => {
                                resultOptions.push(option)
                            })
                        }
                    }
                    if (resultOptions) {
                        column_desc['result_options'] = resultOptions;
                    }
                }
                resColumn.descObj = column_desc;
            }
        } else {
            return { error: `Колонки ${columnName} не существует в таблице ${table}` }
        }
        return resColumn
    } catch (error) {
        console.error(error);
        return {
            error: error
        }
    }
}

export async function getColumns(table) {
    try {
        if (!table) {
            return {
                error: "Таблица должна быть указана"
            };
        }

        let columns = [],
            columnsRes = [];

        if (typeof table == 'object') {
            if (table?.join || table?.union) {
                let tablesQuery = ''
                const tables = table?.join ? table?.join : table?.union
                tables.forEach((t, index) => {
                    if (tablesQuery != '') {
                        tablesQuery += ' OR ';
                    }
                    tablesQuery += `table_name = '${t}'`
                })
                columns = await db.any(`SELECT * FROM information_schema.columns WHERE ${tablesQuery}`)
            }
        } else {
            columns = await db.any(`SELECT * FROM information_schema.columns WHERE table_name = '${table}'`)
        }

        for (let i in columns) {
            columnsRes[i] = await getColumn(table, columns[i].column_name)
        }
        return columnsRes
    } catch (error) {
        return error
    }
}

export async function addProperties(queryProperties, property_table, element_id) {
    try {
        queryProperties.forEach(async (propertyItemQuery) => {
            const deleteOldProps = await db.any(`DELETE FROM property_values WHERE prop_code = '${propertyItemQuery.prop_code}' AND prop_value_element = ${element_id} AND prop_value_table = '${property_table}'`)

            if (deleteOldProps.error) {
                throw { error: deleteOldProps.error }
            }

            const getPropDesc = await db.any(`SELECT * FROM properties WHERE prop_table = '${property_table}' AND slug = '${propertyItemQuery.prop_code}'`)

            if (getPropDesc.error) {
                throw { error: getPropDesc.error }
            }

            const propDesc = getPropDesc[0]

            let saveValue = propertyItemQuery.prop_value;

            if (propDesc.multiple) {
                saveValue = JSON.stringify(saveValue)
            }

            const query = await db.any(`INSERT INTO property_values (prop_code, prop_value, prop_value_table, prop_value_element) VALUES ( '${propertyItemQuery.prop_code}', '${saveValue}', '${property_table}', '${element_id}' )`);

            if (query.error) {
                throw { error: query.error }
            }
        })
        return { success: true };
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function getProperties(property_table, element_id, selectProperties = {}) {
    if (!element_id) {
        return {
            error: 'Не указан ID элемента'
        }
    }
    if (!property_table) {
        return {
            error: 'Не указана таблица '
        }
    }

    let selectByCode = "";
    if (selectProperties.length) {
        let inSql = "(";
        selectProperties.forEach((propertyCode, index) => {
            if (index != 0) {
                inSql += ', ';
            }
            inSql += `'${propertyCode}'`
        })
        inSql += ")";
        selectByCode = `AND prop_code IN ${inSql}`;
    }

    const getProperties = await db.any(`SELECT prop_code, prop_value FROM property_values WHERE prop_value_element = ${element_id} AND prop_value_table = '${property_table}' ${selectByCode}`)
    return getProperties;
}

export async function getLinked(arrLinked, resultItem) {
    try {
        if (!resultItem) {
            throw ('Не указан элемент')
        }
        if (!arrLinked) {
            throw ('Не указаны связи')
        }
        const linkeds = await Promise.all(arrLinked.map(async (linked) => {
            if (linked.need == 'elements' && linked.table && resultItem[linked.field] != '0') {
                let getItems = false;
                if (Array.isArray(resultItem[linked.field])) {
                    getItems = await db.any(`SELECT * FROM ${linked.table} WHERE id = ANY(ARRAY[${resultItem[linked.field]}])`)
                    // getItems = await Promise.all(resultItem[linked.field].map(async (id) => {
                    //     const getItem = await db.any(`SELECT * FROM ${linked.table} WHERE id = ${id}`)
                    //     return getItem[0] ? getItem[0] : false
                    // }))
                } else if (resultItem[linked.field]) {
                    const getItemsQ = await db.any(`SELECT * FROM ${linked.table} WHERE id = ${resultItem[linked.field]}`)
                    if (getItemsQ && getItemsQ.length > 0) {
                        getItems = getItemsQ[0]
                    }
                }
                return ({ field: linked.field, result: getItems })
            } else if (resultItem[linked.field] == '0') {
                return ({ field: linked.field, result: 0 })
            }
        }))
        return linkeds;
    } catch (error) {
        console.error(error)
    }
}

export async function addItem(table, fields = {}) {
    try {
        if (!table) {
            return {
                error: "Таблица должна быть указана"
            };
        }

        let columnsQuery = '',
            valuesQuery = '';
        const tableColumns = await getColumns(table)

        if (tableColumns) {
            tableColumns.map((column) => {
                if (fields[column.column_name]) {
                    if (columnsQuery) {
                        columnsQuery += ', ';
                        valuesQuery += ', ';
                    }

                    columnsQuery += column.column_name;
                    if (fields[column.column_name] == 'NULL') {
                        valuesQuery += `NULL`;
                    } else {
                        if (column.descObj) {
                            if (column.descObj.field_type == 'datetime-local') {
                                fields[column.column_name] = new Date(fields[column.column_name]).toISOString().split('.')[0] + "Z"
                            } else if (column.descObj.multiple) {
                                if (!Array.isArray(fields[column.column_name])) {
                                    fields[column.column_name] = [fields[column.column_name]]
                                }
                                fields[column.column_name] = JSON.stringify(fields[column.column_name])
                            } else if (column.descObj.field_type == 'select' || column.descObj.field_type == 'multiple-select') {
                                if (!Array.isArray(fields[column.column_name]) && column.descObj.field_type == 'multiple-select') {
                                    fields[column.column_name] = fields[column.column_name].split(',')
                                    fields[column.column_name] = JSON.stringify(fields[column.column_name]).replace('[', '{').replace(']', '}')
                                }
                            }
                        }
                        if(typeof fields[column.column_name] == 'object') {
                            // console.log({aa : fields[column.column_name]})
                            fields[column.column_name] = JSON.stringify(fields[column.column_name])
                        }
                        valuesQuery += "'" + fields[column.column_name] + "'";
                    }
                }
            })

            if (columnsQuery != '' && valuesQuery != '') {
                const query = "INSERT INTO " + table + "(" + columnsQuery + ") VALUES(" + valuesQuery + ") RETURNING id";
                const res = await db.any(query);
                return res[0].id;
            } else {
                throw {
                    error: 'Предложенные поля не совпадают с полями таблицы'
                }
            }
        } else {
            throw {
                error: 'Пустые значения'
            }
        }
    } catch (error) {
        return { error: error };
    }
}

export async function updateItems(table, filter = null, values = null) {
    try {
        if (!table) {
            return {
                error: "Таблица должна быть указана"
            };
        }
        if (!values) {
            return {
                error: "Нечего обновлять"
            };
        }

        const tableColumns = await getColumns(table)
        let valuesQuery = []
        let filterQuery = ''

        if (tableColumns) {

            tableColumns.forEach((column) => {

                if (column.column_name in values) {

                    let writeValue = 'NULL';

                    if (values[column.column_name]) {
                        writeValue = values[column.column_name]
                        if (column.descObj) {
                            if (column.descObj.field_type == 'datetime-local' && writeValue != 'NULL') {
                                writeValue = new Date(writeValue).toISOString().split('.')[0] + "Z"
                            } else if (column.descObj.field_type == 'file') {
                                if (column.descObj?.multiple) {
                                    if (!Array.isArray(writeValue)) {
                                        writeValue = [writeValue]
                                    }
                                    writeValue = JSON.stringify(writeValue)
                                }
                            } else if (column.descObj.field_type == 'select' || column.descObj.field_type == 'multiple-select' || column.descObj.multiple) {
                                if (!Array.isArray(writeValue) && column.descObj.field_type == 'multiple-select') {
                                    if (writeValue.indexOf(',') !== -1) {
                                        writeValue = writeValue.split(',')
                                    } else {
                                        writeValue = [writeValue];
                                    }
                                }
                                if (JSON.stringify(writeValue).indexOf('[') + 1) {
                                    writeValue = JSON.stringify(writeValue).replace('[', '{').replace(']', '}')
                                }
                            }
                        }
                    }

                    if (writeValue == 'NULL') {
                        valuesQuery.push(`${column.column_name} = NULL `)
                        // valuesQuery += `${column.column_name} = NULL `;
                    } else {
                        if (typeof writeValue == "string" || (column.descObj && column.descObj.field_type == 'file' && !column.descObj.multiple)) {
                            if (writeValue.indexOf('"') + 1) {
                                writeValue = writeValue.replaceAll('"', '\"')
                            }
                            writeValue = `'${writeValue}'`
                        }
                        // valuesQuery += `${column.column_name} = ${writeValue}`;
                        valuesQuery.push(`${column.column_name} = ${writeValue}`)
                    }
                }

                if (column.column_name in filter) {
                    let writeValue = 'NULL';

                    if (filter[column.column_name]) {
                        writeValue = filter[column.column_name];
                    }
                    if (filterQuery != '') {
                        filterQuery += ', ';
                    }

                    if (writeValue == 'NULL') {
                        filterQuery += column.column_name + " = " + " NULL ";
                    } else {
                        filterQuery += column.column_name + " = " + "'" + writeValue + "'";
                    }

                }
            })

            if (valuesQuery) {
                let query = `UPDATE ${table} SET ${valuesQuery.join(', ')}`;
                
                if (filterQuery) {
                    query += ` WHERE ${filterQuery}`
                }
                query += ' RETURNING id'
                const res = await db.any(query);
                if (res[0] && res[0].id) {
                    return { itemId: res[0].id };
                } else {
                    return res
                }
            } else {
                throw {
                    error: 'Предложенные поля не совпадают с полями таблицы'
                };
            }
        } else {
            throw {
                error: 'Пустые значения'
            };
        }
    } catch (error) {
        return {
            error: error
        }
    }
}

function getWherePart(table, column, filter, wherePart, logic = 'AND', arTables, print = false) {
    let writeValue = 'false';

    const notModifiable = [
        '!false',
        '!null',
        'null',
    ]

    if (!column.isNullable && (filter[column.column_name] || filter[`${column.table_name}.${column.column_name}`])) {
        writeValue = filter[column.column_name] ? filter[column.column_name] : filter[`${column.table_name}.${column.column_name}`]

        if (!notModifiable.includes(writeValue)) {
            if (column.descObj && column.descObj.field_type == 'datetime-local') {
                if (Array.isArray(writeValue)) {
                    writeValue.forEach((val, ind) => {
                        writeValue[ind] = new Date(val).toISOString().split('.')[0] + "Z"
                    })
                } else if (typeof writeValue == 'object') {
                    if (writeValue.from != undefined || writeValue.to != undefined) {
                        if (writeValue.from) {
                            writeValue.from = new Date(writeValue.from).toISOString().split('.')[0] + "Z"
                        }
                        if (writeValue.to) {
                            writeValue.to = new Date(writeValue.to).toISOString().split('.')[0] + "Z"
                        }
                    }
                } else {
                    writeValue = new Date(writeValue).toISOString().split('.')[0] + "Z"
                }
            }
        }
    } else if (logic == 'OR') {
        if (!column.isNullable && filter.logicOr[column.column_name]) {
            writeValue = filter.logicOr[column.column_name]
        }
    }

    let isFromTable = false;
    if (typeof arTables == 'object') {
        if (typeof writeValue == 'string') {
            if (arTables?.join || arTables?.union) {
                const tables = arTables?.join ? arTables?.join : arTables?.union
                tables.forEach((elem) => {
                    if (writeValue.indexOf(`${elem}.`) != -1) {
                        isFromTable = true;
                    }
                })
            }
        }
    }

    let logicPart = ''
    if (wherePart !== '') {
        if (logic == 'OR') {
            logicPart += ' OR '
        } else {
            logicPart += ' AND '
        }
    }

    let conditionPart = ''
    if (typeof writeValue == 'object') {
        if (Array.isArray(writeValue) && writeValue.length > 0 && writeValue[0]) {

            if (writeValue.length > 1) {
                conditionPart += "( "
            }
            writeValue.forEach((val, ind) => {
                if (ind !== 0) {
                    conditionPart += ` OR `
                }
                if (column?.descObj?.field_type == 'multiple-select' || column?.descObj?.multiple) {
                    conditionPart += `'${val}' = ANY(${table}.${column.column_name})`
                } else {
                    conditionPart += `${table}.${column.column_name} = '${val}'`
                }
            })
            if (writeValue.length > 1) {
                conditionPart += " )"
            }
        } else if (writeValue.from != undefined || writeValue.to != undefined) {
            if (writeValue.from == undefined) {
                conditionPart += `${table}.${column.column_name} <= `
                conditionPart += typeof writeValue.to == 'string' ? `'${writeValue.to}'` : `${writeValue.to}`
            } else if (writeValue.to == undefined) {
                conditionPart += `${table}.${column.column_name} >= `
                conditionPart += typeof writeValue.from == 'string' ? `'${writeValue.from}'` : `${writeValue.from}`
            } else {
                conditionPart += `${table}.${column.column_name} >= `
                conditionPart += typeof writeValue.from == 'string' ? `'${writeValue.from}'` : `${writeValue.from}`
                conditionPart += ` AND ${table}.${column.column_name} <= `
                conditionPart += typeof writeValue.to == 'string' ? `'${writeValue.to}'` : `${writeValue.to}`
            }
        } else if (writeValue.exclude && Array.isArray(writeValue.exclude) && writeValue.exclude.length > 0) {
            conditionPart += `${table}.${column.column_name} NOT IN (${writeValue.exclude.join(', ')})`
        }
    } else if (column.descObj) {
        if (column.descObj.field_type == 'multiple-select' || column.descObj.multiple) {
            conditionPart += `'${writeValue}' = ANY(${table}.${column.column_name})`
        } else {
            if (writeValue == '!false') {
                conditionPart += `${table}.${column.column_name} IS NOT NULL AND ${table}.${column.column_name} != '0'`
            } else if (writeValue == '!null') {
                conditionPart += `${table}.${column.column_name} IS NOT NULL`
            } else if (writeValue == 'null') {
                conditionPart += `${table}.${column.column_name} IS NULL`
            } else if (typeof writeValue == 'string' && writeValue.indexOf('!=') == 0) {
                conditionPart += `${table}.${column.column_name} != '${writeValue.substring(2)}'`
            } else if (isFromTable) {
                conditionPart += `${table}.${column.column_name} = ${writeValue}`
            } else if (writeValue) {
                conditionPart += `${table}.${column.column_name} = '${writeValue}'`
            }
        }
    } else {
        if (writeValue == '!false') {
            conditionPart += `${table}.${column.column_name} IS NOT NULL AND ${table}.${column.column_name} != 0`
        } else if (writeValue == '!null') {
            conditionPart += `${table}.${column.column_name} IS NOT NULL`
        } else if (writeValue == 'null') {
            conditionPart += `${table}.${column.column_name} IS NULL`
        } else if (typeof writeValue == 'string' && writeValue.indexOf('!=') == 0) {
            conditionPart += `${table}.${column.column_name} != '${writeValue.substring(2)}'`
        } else if (isFromTable) {
            conditionPart += `${table}.${column.column_name} = ${writeValue}`
        } else {
            conditionPart += `${table}.${column.column_name} = '${writeValue}'`
        }
    }

    if (conditionPart) {
        wherePart += `${logicPart}${conditionPart}`
    }

    return wherePart;
}

export async function selectItems(table, filter = null, sort = null, select = null, limit = 20, page = 0, offset = 0, print = false, needParse = true) {
    try {
        if (!table) {
            throw {
                error: "Таблица должна быть указана"
            };
        }

        let query = 'SELECT '
        let arrLinked = []
        let propertySelect = []

        const tableColumns = await getColumns(table)

        if (Array.isArray(select) && select[0]) {
            select.forEach((elem, index) => {
                if (elem.indexOf("property_") + 1) {
                    propertySelect.push(elem.replace('property_', ''))
                } else if (elem) {
                    if (index == 0) {
                        query += `${elem}`
                    } else {
                        query += `, ${elem}`
                    }
                }
            })
        } else {
            query += '*'
        }

        if (typeof table == 'object' && table?.union) {
            query += ' FROM ('

            const resUnion = await Promise.all(table.union.map(async (tableName, index) => {
                let promiseQuery = '';
                const tableColumnsUnion = await getColumns(tableName)
                promiseQuery += ` ${index != 0 ? 'UNION ALL ' : ''}SELECT * FROM ${tableName} `
                let wherePart = ''
                tableColumnsUnion.forEach((column) => {
                    if (column.table_name == tableName && (column.column_name in filter[tableName]
                        || `${column.table_name}.${column.column_name}` in filter[tableName])
                    ) {
                        wherePart = getWherePart(column.table_name, column, filter[tableName], wherePart, null, tableName, print)
                    }
                })
                if (wherePart.length > 0) {
                    promiseQuery += ` WHERE ${wherePart} `
                }
                return promiseQuery
            }));
            resUnion.map((str) => {
                query += str
            })
            query += ' ) as union_result '
        } else {
            if (typeof table == 'object') {
                if (table?.join) {
                    table.join.forEach((t, index) => {
                        if (index == 0) {
                            query += ` FROM ${t}`
                        } else {
                            query += ` JOIN ${t}`
                        }
                    })
                }
            } else {
                query += ` FROM ${table}`
            }

            if (filter && tableColumns) {
                let wherePart = ''
                tableColumns.forEach((column) => {
                    if (column.column_name in filter || `${column.table_name}.${column.column_name}` in filter) {
                        wherePart = getWherePart(column.table_name, column, filter, wherePart, null, table, print)
                    } else if (filter.logicOr) {
                        if (column.column_name in filter.logicOr) {
                            wherePart = getWherePart(table, column, filter, wherePart, 'OR', table, print)
                        }
                    }
                })


                if (wherePart !== '') {
                    if (typeof table == 'object') {
                        if (table?.join) {
                            query += ` ON `
                        } else {
                            query += ` WHERE `
                        }
                    } else {
                        query += ` WHERE `
                    }
                    query += wherePart;
                }
            }
        }

        if (sort && typeof sort != undefined && tableColumns) {
            query += ' ORDER BY '
            if (sort == 'RANDOM') {
                query += ` RANDOM () `
            } else {
                let sortIndex = Number(0);
                for (const key in sort) {
                    query += `${sortIndex != 0 ? ',' : ''} ${key} ${sort[key].toUpperCase()}`
                    sortIndex += Number(1)
                }
                query += `, ${table}.id ASC `
            }
        }

        if (limit != 'all') {
            query += ` LIMIT ${limit}`

            if (page != 0) {
                query += ` OFFSET ${(page * limit) - limit}`
            } else if (offset) {
                query += ` OFFSET ${offset}`
            }
        }

        let result = null;

        if (limit == 1) {
            result = await db.any(query)
            if (typeof result[0] != 'undefined') {
                result = result[0]
            }
        } else {
            result = await db.any(query)
        }

        if (typeof table != 'object') {
            tableColumns.forEach((column) => {
                if (column.descObj) {
                    if (column.descObj.options) {
                        const options = JSON.parse(column.descObj.options)
                        if (options.from_database) {
                            const option = options.from_database.split('.')
                            arrLinked.push({ table: option[0], field: column.column_name, need: option[1] })
                        }
                    }
                }
            })
        }

        if (result.error) {
            throw { error: result.error }
        } else if (Array.isArray(result)) {
            const asyncResult = await Promise.all(result.map(async (resultItem) => {
                if (Array.isArray(propertySelect) && typeof table != 'object') {
                    const propsArr = await getProperties(table, resultItem.id, propertySelect)
                    resultItem.properties = {}
                    if (Array.isArray(propsArr)) {
                        propsArr.map((property) => {
                            resultItem.properties[property.prop_code] = property.prop_value
                        })
                    }
                }

                if (Array.isArray(arrLinked) && typeof table != 'object' && needParse) {
                    const linkedsArr = await getLinked(arrLinked, resultItem)
                    if (Array.isArray(linkedsArr)) {
                        linkedsArr.map((linked) => {
                            resultItem[linked.field] = linked.result
                        })
                    }
                }

                if(resultItem?.map_coordinates ||  resultItem?.coordinates) {
                    const variable = resultItem?.map_coordinates ? "map_coordinates" : "coordinates";
                    const coordinates = JSON.parse(resultItem[variable])
                    resultItem[variable] = coordinates
                }

                return resultItem
            }));
            return asyncResult.length ? asyncResult : false;
        } else if (result) {

            if (Array.isArray(propertySelect) && typeof table != 'object') {
                const propsArr = await getProperties(table, result.id, propertySelect)
                result.properties = {};
                if (Array.isArray(propsArr)) {
                    propsArr.map((property) => {
                        result.properties[property.prop_code] = property.prop_value
                    })
                }
            }
            if (Array.isArray(arrLinked) && typeof table != 'object' && needParse) {
                const linkedsArr = await getLinked(arrLinked, result)
                if (Array.isArray(linkedsArr)) {
                    linkedsArr.map((linked) => {
                        result[linked.field] = linked.result
                    })
                }
            }
            return result
        }
    } catch (error) {
        console.log('errordb', {method: "selectItems",table, filter, sort, select, limit, page, offset}, error)
        return ({
            error: error
        })
    }
}

export async function getCount(table, filter = null) {
    try {
        if (!table) {
            throw {
                error: "Таблица должна быть указана"
            };
        }

        let query = '';

        const tableColumns = await getColumns(table)

        if (typeof table == 'object' && table?.union) {
            query = `SELECT count(*) FROM (`
            table?.union.forEach((table, index) => {
                query += ` ${index != 0 ? 'UNION ALL ' : ''}SELECT * FROM ${table} `
                let wherePart = ''
                tableColumns.forEach((column) => {
                    if (column.table_name == table && (column.column_name in filter[table] || `${column.table_name}.${column.column_name}` in filter[table])) {
                        wherePart = getWherePart(column.table_name, column, filter[table], wherePart, null, table)
                    }
                })
                if (wherePart.length > 0) {
                    query += ` WHERE ${wherePart} `
                }
            })
            query += ' ) as unionResult'
        } else {
            query = `SELECT count(*) FROM ${table}`;

            if (filter && tableColumns) {
                let wherePart = '';
                tableColumns.forEach((column) => {
                    if (column.column_name in filter) {

                        wherePart = getWherePart(table, column, filter, wherePart)

                    } else if (filter.logicOr) {
                        if (column.column_name in filter.logicOr) {

                            wherePart = getWherePart(table, column, filter, wherePart, 'OR')

                        }
                    }
                })

                if (wherePart !== '') {
                    query += ` WHERE ${wherePart}`;
                }
            }
        }
        const result = await db.one(query)
        return result
    } catch (e) {
        console.error(e)
        return ({
            error: e
        })
    }
}

export async function deleteItems(table, filter) {
    try {
        if (!table) {
            return {
                error: "Таблица должна быть указана"
            };
        }
        if (!filter) {
            return {
                error: "Фильтр обязателен 2"
            }
        }
        let queryDelete = `DELETE FROM ${table}`;
        let querySelect = `SELECT * FROM ${table}`;
        // let columns = await getColumns(table)
        const tableColumns = await getColumns(table)
        if (filter && tableColumns) {
            let wherePart = '';
            tableColumns.forEach((column) => {
                if (column.column_name in filter) {

                    wherePart = getWherePart(table, column, filter, wherePart)

                } else if (filter.logicOr) {
                    if (column.column_name in filter.logicOr) {

                        wherePart = getWherePart(table, column, filter, wherePart, 'OR')

                    }
                }
            })

            // if (wherePart !== '') {
            //     query += ` WHERE ${wherePart}`;
            // }
            if (wherePart !== '') {
                queryDelete += ` WHERE ${wherePart}`;
                querySelect += ` WHERE ${wherePart}`;
            }
        }

        // const resultSelect = await db.any(querySelect)
        // let filesToDelete = [];
        // resultSelect.forEach((element) => {
        //     tableColumns.forEach((column) => {
        //         if (column.descObj) {
        //             if (column.descObj.field_type == 'file') {
        //                 filesToDelete.push(element[column.column_name])
        //             }
        //         }
        //     })
        // })
        // filesToDelete.forEach( async function(path) {
        //     await unlink(path);
        // } )
        const result = await db.any(queryDelete)
        return result;
    } catch (e) {
        console.error(e)
        return ({
            error: e
        })
    }
}

export async function getTables() {
    const dbResponse = await db.any(`SELECT * FROM information_schema.tables WHERE table_schema = 'public'`)
    return dbResponse
}

// export async function clearProperties() {
//     const propertyItems = await selectItems('property_values', false, false, false, 'all', false, false, true);
//     const results = await Promise.all(propertyItems.map(async (propertyItem) => {
//         const exists = await selectItems(propertyItem.prop_value_table, { id: propertyItem.prop_value_element }, false, false, 1)

//         if (!exists || !propertyItem.prop_value_table || !propertyItem.prop_value_element) {
//             await deleteItems('property_values', { id: propertyItem.id })
//         }
//     }))
//     if (results) {
//         return true
//     }
//     return false
// }