import { getColumns, selectItems } from "lib/postgresql/db.js";

function prepareOptions(columnName, field) {
    try{
        if (!columnName) {
            return false;
          }
      
          let fieldDesc, options;
      
          if (!field) {
            return false;
          }

          if (typeof field.options != 'undefined') {
            if (typeof field.options == "string") {
              field.options = JSON.parse(field.options);
            }
            options = field.options.values;
          } else {
            fieldDesc = field && field.descObj;

            if(fieldDesc.result_options){
                options = fieldDesc.result_options
            } else if (typeof fieldDesc.options == "string") {
                fieldDesc.options = JSON.parse(fieldDesc.options);
                options = fieldDesc.options.values;
            }else{
                options = fieldDesc && fieldDesc.options;
            }
          }
      
          const firstValue = options ? options[0] : undefined;
          if (typeof firstValue == "object") {
            return options;
          } else if (options) {
            let resultOptions = [];
            options &&
              options.forEach((option, index) => {
                resultOptions.push({ id: index, name: option });
              });
            return resultOptions;
          } else {
            return false
          }
    } catch(e) {
        return e
    }
}

export async function getCreateFields(table) {
    let fieldsArray = {};

    let columns = false;
    if (table) {
        columns = await getColumns(table)
    } else {
        res.status(500).json({ error: "Не указана таблица" })
    }

    if (columns) {
        fieldsArray['columns'] = columns;
    }

    const props = await selectItems('properties', { prop_table: table })
    if (props.length) {
        fieldsArray['properties'] = props;
    }

    return fieldsArray;
}

export async function getCreateFieldsUserAdmin(table) {
    let fieldsArray = {};

    let columns = false;
    if (table) {
        columns = await getColumns(table)
    } else {
        res.status(500).json({ error: "Не указана таблица" })
    }

    if (columns) {
        fieldsArray.columns = {}
        columns.forEach((column) => {
            const optionValues = prepareOptions(column.column_name, column)
            if(optionValues){
                column.resultOptions = optionValues
            }
            fieldsArray.columns[column.column_name] = column
        })
    }

    const props = await selectItems('properties', { prop_table: table })
    if (props.length) {
        fieldsArray.properties = {}
        props.forEach((prop) => {
            const optionValues = prepareOptions(prop.slug, prop)
            if(optionValues){
                prop.resultOptions = optionValues
            }
            fieldsArray.properties[prop.slug] = prop; 
        })
    }

    return fieldsArray;
}

export default async (req, res) => {

    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }
        const table = fields.table;

        let fieldsArray = false;
        if(fields.version == 'userAdmin'){
            fieldsArray = await getCreateFieldsUserAdmin(table)
        }else{
            fieldsArray = await getCreateFields(table)
        }

        res.status(200).json(fieldsArray)
    } catch (e) {
        res.status(200).json({ error: e })
    }
}