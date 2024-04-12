const { getData } = require("helpers/db/getData");

export async function getUserById(userId){
    if(!userId){
        return {error: 'Id обязателен для получения по нему'}
    }
    const getUserFields = {
        table: 'users',
        filter: {id: userId},
        select: ['id', 'phone', 'user_token', 'token_salt', 'last_user_agent'],
        limit: 1
    }
    
    const getUser = await getData(getUserFields);
    if(getUser){
        if(!getUser.error){
            return getUser
        }else{
            return {error: getUser.error}
        }
    } else {
        return {error: 'Не найден пользователь'}
    }
}

export default async function(req, res){
    if(!req.userId){
        res.status(200).json({error: 'userId required'})
    }else{
        const {userId} = req.userId
        const getUser = await getUserById(userId);
        if(getUser){
            if(!getUser.error){
                res.status(200).json(getUser);
            }else{
                res.status(200).json({error: getUser});
            }
        }else{
            res.status(200).json({error: 'Не найден пользователь'})
        }
    }    
}