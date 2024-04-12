import axios from "axios";
import db from "lib/postgresql/db"

const tableName = "images";

require('dotenv').config()

const imageController = {
    documentRoot: process.env.DOCUMENT_ROOT,
    tmpFolder: process.env.UPLOAD_FILE_PATH_TMP,
    uploadFolder: process.env.UPLOAD_FILE_PATH,

    getTmpPath: () => {
        return `${imageController.documentRoot}/${imageController.tmpFolder}/${imageController.folderByDate()}/`
    },
    getUploadPath: () => {
        return `${imageController.documentRoot}/${imageController.uploadFolder}/${imageController.folderByDate()}/`
    },
    folderByDate: () => {
        return new Date().toISOString().split('T')[0];
    },
    getById: async ({id}) => {
        if(!id) {
            return {error: "ID обязателен"}
        }
        try {
            return await db.one(`SELECT * FROM ${tableName} WHERE id = ${id}`)
        } catch (e) {
            return {error: e}
        }
    },
    add: async ({file}) => {
        if(!file.path) {
            return {error: "File path is not defined"}
        }
        try {
            const filename = file.newFilename;
            const folder = file.path.replace(file.newFilename, '');
            const date_created = new Date().toISOString().split('.')[0] + "Z";
            const tmp = 'true';
            const path = file.path;
            const fileType = file.mimetype;

            const fields = 'path, tmp, date_created, filename, folder, filetype'
            const values = `'${path}', '${tmp}', '${date_created}', '${filename}', '${folder}', '${fileType}'`;
            const query = `INSERT INTO ${tableName} (${fields}) VALUES (${values}) RETURNING id, path`;

            return await db.any(query)
        } catch (e) {
            return {error: e}
        }
    },
    publishImage: async ({id}) => {
        if(!id) {
            return {error: 'ID обязателен'}
        }

        try {
            const get = imageController.getById(id)
            const oldPath = get.path
            const newPath = imageController.getUploadPath()
            const filename = get.filename;

            console.log('test', {oldPath, newPath, filename})

            // const res = imageController.changePath(oldPath, newPath, filename)
            // return await db.any(`UPDATE ${tableName} SET tmp = 'false', path='' WHERE id = ${id} `)
        } catch (e) {
            return {error: e}
        }
    },
    changePath: async ({oldPath, newPath, filename}) => {
        try {
            return imageController.rename({oldPath, newPath, filename})
        } catch (e) {
            return {error: e}
        }
    },
    rename: async ({oldPath, newPath, filename}) => {
        try {
            const newName = newPath+filename;
            fs.rename(oldPath, newName, function (err) {
                if (err) throw err
            })
        } catch (e) {
            return {error: e}
        }
    },
    addFromPath: async ({path}) => {
        const response = await fetch(path)
        const arrayBuffer = await response.arrayBuffer();

        const blob = new Blob([arrayBuffer, { type: 'image/png' }]);
        blob.lastModifiedDate = new Date();
        blob.name = 'tmp.png';
        const addResult = await imageController.add({file})

        return addResult
    }
}

export default imageController;
