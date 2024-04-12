import { getColumns } from "/lib/postgresql/db"

export default async (req, res) => {
    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }

        const table = fields.table;
        if (table) {
            const columns = await getColumns(table)
            res.status(200).json(columns)
        } else {
            res.status(500).json({ error: "Не указана таблица" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error })
    }
}