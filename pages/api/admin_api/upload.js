import imageController from 'controllers/images';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    }
};

require('dotenv').config()

export default async (req, res) => {

    const documentRoot = process.env.DOCUMENT_ROOT

    const data = await new Promise((resolve, reject) => {
        
        const tmpFolder = imageController.getTmpPath()
        
        if (!fs.existsSync(tmpFolder)) {
            fs.mkdirSync(tmpFolder, { recursive: true });
        }

        const form = formidable({
            multiples: true,
            uploadDir: tmpFolder,
            keepExtensions: true,
        });

        let fileResult = {};

        form.on('error', function(err) {
            console.log("an error has occured with form upload");
            console.log(err);
            request.resume();
        });

        form.on('file', function(field, file) {
            fileResult = file;
            let filepath = fileResult.filepath
            filepath = filepath.replaceAll('\\', '/')
            filepath = filepath.replace(`${imageController.documentRoot}public/`, '')
            filepath = filepath.replace(`${imageController.documentRoot}`, '')
            fileResult.path = filepath
        });

        form.on('end', async function () {
            // console.log('fileResult', fileResult)
            const res = await imageController.add(fileResult);
            resolve(res)
        })

        form.parse(req, (err, fields, files) => {})
    })

    res.status(200).json( data )
}