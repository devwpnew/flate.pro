import { getCount } from "lib/postgresql/db"

export default async (req, res) => {
    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }
        if (fields) {
            const response = await getCount(fields.table, fields.filter)
            res.status(200).json(response)
        } else {
            res.status(500).json({ error: "Поля пусты или указаны неверно" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error })
    }
}