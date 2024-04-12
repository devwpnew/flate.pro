import axios from "axios";

export default async (req, res) => {
    try {
        let fields = null;
        if (req.method == 'GET') {
            fields = JSON.parse(req.query.fields);
        } else if (req.method == 'POST') {
            fields = req.body;
        }

        if (fields.imageUrl) {
            const response = await axios.get(`https://flate.pro${fields.imageUrl}`, {responseType: 'arraybuffer'})
            if(response.data){
                res.status(200).send(response.data)
            }
        } else {
            res.status(200).json({error: "Поля пусты или указаны неверно"})
        }
    } catch (error) {
        res.status(200).json({ error: error })
    }
}