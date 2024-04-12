import axios from "axios";
import { getData } from "helpers/db/getData";
import { updateItems } from "lib/postgresql/db";
import { SMSRu } from "node-sms-ru";
import API from "../service/api";

export default async function(req, res) {
    const { window_host, text, fields } = req.body;

    if(!fields.user_id){
        return {error: "Не передан ID пользователя"}
    }

    const smsRu = new SMSRu(process.env.SMSRU_API_KEY);
    let answer = false;
    answer = {status: 'offed'}

    // if(fields.user_id == 'all'){
    //     const users = await API.get.user({filter: {id: 89}, window_host: window_host })
    //     if(users && users.length) {
    //         answer = await Promise.all(users.map (async (user) => {
    //             return await smsRu.sendSms({
    //                 from: 'FLATE.PRO',
    //                 to: user.phone,
    //                 msg: text
    //             });
    //         }))
    //     }
    // } else {
    //     answer = {status: 'offed'}
    //     const user = await API.get.user({filter: {id: fields.user_id}, limit: 1, window_host: window_host})
    //     answer = await smsRu.sendSms({
    //         from: 'FLATE.PRO',
    //         to: user.phone,
    //         msg: text
    //     });
    // }

    res.status(200).json(answer)
}