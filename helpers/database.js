const sortValues = {
    "asc": 'ASC',
    "desc": 'DESC',

    "asc, nulls": "ASC NULLS LAST",
    "desc, nulls": "DESC NULLS LAST",

    "ASC, NULLS": "ASC NULLS LAST",
    "DESC, NULLS": "DESC NULLS LAST",

    "asc,nulls": "ASC NULLS LAST",
    "desc,nulls": "DESC NULLS LAST",

    "ASC,NULLS": "ASC NULLS LAST",
    "DESC,NULLS": "DESC NULLS LAST",

    "nulls, asc": "ASC NULLS FIRST",
    "nulls, desc": "DESC NULLS FIRST",

    "NULLS, ASC": "ASC NULLS FIRST",
    "NULLS, DESC": "DESC NULLS FIRST",

    "nulls,asc": "ASC NULLS FIRST",
    "nulls,desc": "DESC NULLS FIRST",

    "NULLS,ASC": "ASC NULLS FIRST",
    "NULLS,DESC": "DESC NULLS FIRST",
}

export function formatDateToDB(date) {
    return date.toISOString().split('.')[0] + "Z"
}

export function filterToString(filter = false) {
    let filterStr = ''
    if (filter) {
        if (typeof filter != 'object') {
            throw new Error('filter должен быть объектом')
        }
        for (const field in filter) {
            let addValue = '';
            if (typeof filter[field] == 'object') {
                if (Array.isArray(filter[field])) {
                    addValue = `${field} = ANY( ARRAY[`
                    filter[field].map((val, index) => {
                        // console.log({val, type: , is: isNumeric(val)})
                        addValue += typeof val == 'number' ? `${val}` : `'${val}'`
                        if (index != filter[field].length - 1) {
                            addValue += `, `
                        }
                    })
                    addValue += `] )`
                } else {
                    if (filter[field].from) {
                        addValue = `${field} >= ${filter[field].from}`
                    }
                    if (filter[field].to) {
                        addValue = `${field} <= ${filter[field].to}`
                    }
                }
            } else {
                addValue = `${field} = '${filter[field]}'`;
            }
            if (filterStr != '') {
                filterStr += ` AND ${addValue}`
            } else {
                filterStr += `WHERE ${addValue}`;
            }
        }
    }
    return filterStr
}

export function controllerError(e, fields) {
    console.error({ e, fields })
    return { error: e.toString(), fields }
}

export function sortToString(sort) {
    let sortStr = '';
    if (sort) {
        if (typeof sort != 'object') {
            throw new Error('sort должен быть объектом')
        }
        for (const name in sort) {
            const sortValue = sortValues[sort[name]] ? sortValues[sort[name]] : sort[name]
            if (sortStr != '') {
                sortStr = `, ${name} ${sortValue}`
            } else {
                sortStr = `ORDER BY ${name} ${sortValue}`
            }
        }
    }
    return sortStr
}

export function selectToString(select, type) {
    let selectStr = ''
    if (type == 'EDIT') {
        if (Array.isArray(select)) {
            selectStr += `RETURNING ${select.join(', ')}`
        }
    } else {
        if (Array.isArray(select)) {
            selectStr = select.join(', ')
        } else {
            selectStr = '*'
        }
    }
    return selectStr
}

export function arrayToDatabase(array) {
    if (Array.isArray(array)) {
        const format = JSON.stringify(array).replace('[', '{').replace(']', '}');
        return `'${format}'`
    }
    return ''
}

export function offsetToString(page, limitVar) {
    return ((page && Number(page) - 1 > 0) ? `OFFSET ${Number(page - 1) * Number(limitVar)}` : '')
}