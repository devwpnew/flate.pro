import imageController from 'controllers/images';

export const config = {
    api: {
        bodyParser: false,
    }
};

require('dotenv').config()

export default async (req, res) => {
    console.log('req.query', req.query)
    let fields = null;
    if (req.method == 'GET') {
        fields = JSON.parse(req.query.fields);
    } else if (req.method == 'POST') {
        console.log('req', req)
        console.log('req.body', req.body)
        fields = req.body;
    }

    console.log('fields', fields)
    res.status(200).json({ fields })
}