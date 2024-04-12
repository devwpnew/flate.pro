import controllers from "controllers/main";

require('dotenv').config()

export default async (req, res) => {
    try {
        let fields = null
        if (req.method != 'POST' && req.method != 'OPTIONS') {
            throw new Error(`Method GET is not allowed`)
        }
        fields = req.body

        const controller = controllers[req.query.controller]

        if(!controller) {
            throw new Error(`Controller "${req.query.controller}" doesn't exist`)
        }

        if(!controller[req.query.method]) {
            throw new Error(`Method "${req.query.method}" doesn't exist in "${req.query.controller}"`)
        }

        const controllerFunction = controller[req.query.method]
        
        const response = await controllerFunction(fields)

        res.status(200).json(response)
    } catch (e) {
        console.error(e)
        res.status(200).json(e.toString())
    }
}