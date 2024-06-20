import { updateItems, selectItems, addProperties } from "lib/postgresql/db.js";
import formidable from 'formidable';
import fs from 'fs';
import NextCors from "nextjs-cors";

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
            let editObject = {};
            let createProperties = {};
            let filter = {};
            let folderByDate = new Date();
            let dir = `${process.env.UPLOAD_FILE_PATH}/${folderByDate.toISOString().split('T')[0]}/`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const form = formidable({
                multiples: true,
                uploadDir: dir,
                keepExtensions: true
            });
            let fields = [], files = [];

            form.on('field', function (field, value) {
                fields.push([field, value]);
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
                            editObject[fields[k][0]] = false;
                        } else {
                            editObject[fields[k][0]] = fields[k][1]
                        }
                    }

                    if (fields[k][0] == 'published' && fields[k][1] == 1 && editObject['date_published'] == '') {
                        editObject['date_published'] = date;
                    }

                    if (fields[k][0] == 'id') {
                        filter = { id: fields[k][1] }
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
                        if(editObject[file[0]]){
                            const nextValue = filepath
                            if(!Array.isArray(editObject[file[0]])){
                                const firstValue = editObject[file[0]]
                                editObject[file[0]] = [firstValue]
                            }
                            let inList = false;
                            editObject[file[0]].forEach(function (item, index) {
                                if(item == nextValue){
                                    inList = true;
                                }
                            })
                            if(!inList){
                                editObject[file[0]].push(nextValue)
                            }
                        }else{
                            if(file[1].filepath){
                                editObject[file[0]] = filepath
                            }
                        }
                    }
                }

                if(editObject['date_change'] != 'false'){
                    editObject['date_edited'] = date;
                }

                resolve({ editObject, createProperties, filter })
            });
            form.parse(req);
        })

        let { editObject, createProperties, filter } = formidableData

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
        res.status(200).send({ error, function: 'admin_api/edit' })
    }
};