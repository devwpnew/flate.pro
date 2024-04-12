import api from '../service/api';

require('dotenv').config()

const domen = process.env.DOMEN

export default async function handler(req, res) {
    try {
        let fields = null;
        let arRes = false;

        if (req.method == 'GET') {
            const preFields = (req.query.fields[0] == '%' ? decodeURI(req.query.fields) : req.query.fields);
            fields = JSON.parse(preFields)
        } else if (req.method == 'POST') {
            fields = req.body.fields;
        }

        const token = fields.pushToken
        const isExistToken = await api.get.tokenRow(token, domen)
        arRes = {Exist: isExistToken};
        if(!isExistToken) {
            arRes = {Add: await api.add.token(token, domen)}
        }
        res.status(200).json({arRes})
    } catch (error) {
        console.error(error);
        res.status(200).json(error)
    }
}