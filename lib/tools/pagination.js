import axios from "axios";

export default async function getPagination(fields) {
    require('dotenv').config()
    const domen = process.env.DOMEN;

    const limit = fields.limit ? fields.limit :  20;
    const countResponse = await axios.post(`${domen}/api/admin_api/getCount`, fields)
    
    const count = countResponse.data.count

    const pagesQuantity = Math.ceil(count/limit)

}