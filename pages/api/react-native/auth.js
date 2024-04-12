import { updateItems, selectItems, addProperties } from "lib/postgresql/db.js";
import NextCors from "nextjs-cors";

require('dotenv').config()

export default async (req, res) => {
    try {
        await NextCors(req, res, {
            // Options
            methods: ['GET'],
            origin: '*',
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });

        let fields = false;
        if (req.method == 'GET') {
            fields = req.query.fields ? JSON.parse(req.query.fields) : false;
        } else if (req.method == 'POST') {
            fields = req.body;
        }

        let editObject = {}
        let createProperties = {}
        let filter = {}
        const date = new Date();

        if(fields._parts) {
            fields = fields._parts;
        }

        for (let k in fields) {
            if (fields[k][0].indexOf("property_") + 1) {
                createProperties[fields[k][0].replace("property_", "")] = fields[k][1]
            } else if (fields[k][0] != 'id') {
                if (fields[k][0] == '') {
                    editObject[fields[k][0]] = false;
                } else {
                    editObject[fields[k][0]] = fields[k][1]
                }
            }

            if (fields[k][0] == 'published' && fields[k][1] == '1' && editObject['date_published'] == '') {
                editObject['date_published'] = date;
            }

            if (fields[k][0] == 'id') {
                filter = { id: fields[k][1] }
            }
        }

        if (editObject['date_change'] != 'false') {
            editObject['date_edited'] = date;
        }

        const updateRequest = await updateItems(editObject.table, filter, editObject);

        if (updateRequest.error) {
            res.status(200).json({ error: updateRequest })
        } else {
            const getItem = await selectItems(editObject.table, filter, null, null, 1);
            if (createProperties) {
                let propertyQuery = [];
                for (let k in createProperties) {
                    propertyQuery.push({ prop_code: k, prop_value: createProperties[k] })
                }
                const addPropQuery = await addProperties(propertyQuery, editObject.table, getItem.id);
                if (addPropQuery.error) {
                    throw ({ error: addPropQuery })
                }
            }
            res.status(200).json({ itemId: getItem.id })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error })
    }
}