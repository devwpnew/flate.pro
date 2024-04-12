import { selectItems } from "lib/postgresql/db"

export default async (req, res) => {
    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }

        if (fields) {
            const response = await selectItems(fields.table, fields.filter, fields.sort, fields.select, fields.limit, fields.page, fields.offset, fields.print, fields.needParse)
            // console.log('response', response)
            res.status(200).json(response)
        } else {
            res.status(200).json({ error: "Поля пусты или указаны неверно" })
        }
    } catch (error) {
        res.status(200).json({ error: error })
    }
}