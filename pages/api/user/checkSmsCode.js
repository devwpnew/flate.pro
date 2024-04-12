import { getData } from "helpers/db/getData";

export default async function(req, res){
    const {userId, userInputOtp} = req.method == 'POST' ? req.body : JSON.parse(req.query.fields);
    const getUserFields = {
        table: 'users',
        select: ['id', 'otp_code'],
        filter: {id: userId},
        limit: 1
    }
    const getUser = await getData(getUserFields);
    if(!getUser.error){
        if(getUser.otp_code == userInputOtp){
            res.status(200).json({response: 'correct'})
        }else{
            res.status(200).json({error: 'Неверный код'})
        }
    }else{
        res.status(200).json({error: getUser})
    }
}