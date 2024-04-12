export default function newAbuse(fields){
    if(fields?.product){
        return (`
            <p>ID:${fields.product.id}<p>
            <p>Название:${fields.product.name}<p>
            <p>От пользователя:${fields.user.id}</p>
        `)
    }else if(fields?.user){
        return (`
            <p>ID:${fields.user.id}<p>
            <p>Телефон:${fields.user?.phone}<p>
        `)
    }
}