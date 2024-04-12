export default function UnpublishTemplate(arProduct){
    return (`
        <p>ID: ${arProduct.id}</p>
        <p>Название: ${arProduct.name}</p>
    `)
}