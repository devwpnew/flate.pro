import { clearProperties, deleteItems } from "lib/postgresql/db.js";

export default async (req, res) => {
    try {
        // if(req.body.cronProperties == 'Y'){
        //     res.status(200).json({ success: await clearProperties() })
        // }else{
            const test = await deleteItems(req.body.table, req.body.filter);

            if (test.error) {
                res.status(200).json({ error: test.error })
            } else {
                res.status(200).json({ success: true })
            }
        // }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error })
    }
};