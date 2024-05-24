import { addItem, selectItems, addProperties, updateItems, getColumn } from "lib/postgresql/db";
import formidable from 'formidable';
import fs from 'fs';
import { textToCode } from "helpers/productFunctions";

require('dotenv').config()

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    try {

        const date = new Date();

        const formidableData = await new Promise((resolve, reject) => {
            let createObject = {};
            let createProperties = {};
            let folderByDate = new Date();
            let dir = `${process.env.UPLOAD_FILE_PATH}/${folderByDate.toISOString().split('T')[0]}/`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const form = formidable({
                multiples: true,
                uploadDir: dir,
                keepExtensions: true,
            });

            let fields = [], files = [];
            form.on('field', function (field, value) {
                fields.push([field, value])
            })
            form.on('file', function (field, file) {
                if(file.size){
                    files.push([field, file])
                }
            })
            form.on('end', function () {
                for (let k in fields) {
                    if (fields[k][0].indexOf("property_") + 1) {
                        createProperties[fields[k][0].replace("property_", "")] = fields[k][1]
                    } else if (fields[k][0] != 'id') {
                        if (fields[k][0] == '') {
                            createObject[fields[k][0]] = false
                        } else {
                            createObject[fields[k][0]] = fields[k][1]
                        }
                    }

                    if (fields[k][0] == 'published' && fields[k][1] == 'on' && createObject['date_published'] == undefined) {
                        createObject['date_published'] = date
                    }

                }
                let documentRoot = process.env.DOCUMENT_ROOT
                for (let k in files) {
                    let filepath = undefined
                    const file = files[k]
                    if(file[1].filepath){
                        filepath = file[1].filepath;
                        filepath = filepath.replaceAll('\\', '/')
                        filepath = filepath.replace(`${documentRoot}public/`, '')
                        filepath = filepath.replace(`${documentRoot}`, '')
                    }
                    if (file[0].indexOf("property_") + 1) {
                        if (!createProperties[file[0].replace("property_", "")]) {
                            createProperties[file[0].replace("property_", "")] = []
                        }
                        let inList = false;
                        createProperties[file[0].replace("property_", "")].forEach(function (item, index) {
                            if(item == filepath){
                                inList = true;
                            }
                        })
                        if(!inList){
                            createProperties[file[0].replace("property_", "")].push(filepath)
                        }
                    } else {
                        let inList = false;
                        if(createObject[file[0]]){
                            const nextValue = filepath
                            if(!Array.isArray(createObject[file[0]])){
                                const firstValue = createObject[file[0]]
                                createObject[file[0]] = [firstValue]
                            }
                            let inList = false;
                            createObject[file[0]].forEach(function (item, index) {
                                if(item == nextValue){
                                    inList = true;
                                }
                            })
                            if(!inList){
                                createObject[file[0]].push(nextValue)
                            }
                        }else{
                            if(file[1].filepath){
                                createObject[file[0]] = filepath
                            }
                        }
                    }
                }
                createObject['date_created'] = date;

                resolve({ createObject, createProperties })
            })
            form.parse(req)
        })

        let { createObject, createProperties } = formidableData

        createObject['date_created'] = date;

        const itemTable = createObject.table;

        delete createObject.table;

        const addQuery = await addItem(itemTable, createObject);
        if (addQuery.error) {
            res.status(200).json({ error: { addQuery: addQuery } })
        } else {
            const getItem = await selectItems(itemTable, {id: addQuery}, null, null, 1)

            if (createProperties) {
                let propertyQuery = [];
                for (let k in createProperties) {
                    if(Array.isArray(createProperties[k])){
                        createProperties[k] = [...new Set(createProperties[k])]
                    }
                    propertyQuery.push({ prop_code: k, prop_value: createProperties[k] })
                }
                const addPropQuery = await addProperties(propertyQuery, itemTable, getItem.id);
                if (addPropQuery.error) {
                    throw ({ error: { prop: addPropQuery.error } })
                }
            }
            const hasSlug = await getColumn(itemTable, 'slug')
            if(!hasSlug.error){
                let slug = textToCode(getItem['name'])
                slug = slug.toLowerCase()
                slug += `-${addQuery}`
                const resUpdate = await updateItems(itemTable, {id: addQuery}, {slug: slug} )
                res.status(200).json({ itemId: getItem.id, resUpdate: resUpdate })
            } else {
                res.status(200).json({ itemId: getItem.id })
            }
        }

        // res.status(200).json({t:'t'})
    } catch (error) {
        console.error(error);
        res.status(200).send({ error: error })
    }
};