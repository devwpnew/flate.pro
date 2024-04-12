const { getTables } = require("lib/postgresql/db");

export default async function handler(req, res) {
    try {
        const response = await getTables();
        res.status(200).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error })
    }
}