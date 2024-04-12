import { selectItems } from "lib/postgresql/db";
import { getColumns } from "lib/postgresql/db"
import { getProperties } from "lib/postgresql/db"

export async function getEditFields(fields) {

    const table = fields.table;
    const id = fields.elemId;

    let fieldsArray = {};
    if (table) {
        fieldsArray['columns'] = await getColumns(table);
        fieldsArray['element'] = await selectItems(table, { id: id }, null, null, 1);

        const getProps = await selectItems('properties', { prop_table: table })
        if (getProps.length) {
            fieldsArray['properties'] = getProps
        }

        let propertyValues = await getProperties(table, id);

        if (propertyValues.length) {
            for (let key in propertyValues) {
                if (fieldsArray['property_values'] == undefined) {
                    fieldsArray['property_values'] = {};
                }
                fieldsArray['property_values'][propertyValues[key]['prop_code']] = propertyValues[key]['prop_value']
            }
        }

        return JSON.stringify(fieldsArray)
    } else {
        return { error: "Не указана таблица" }
    }
}

export default async (req, res) => {
    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }

        const editFields = await getEditFields(fields);

        res.status(200).json({ response: editFields })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error })
    }
}