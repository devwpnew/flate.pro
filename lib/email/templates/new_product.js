export default function NewProductTemplate(productFields){
    return (`
        <p>ID:${productFields.id}<p>
        <p>Название:${productFields.name}<p>
        <p>Адрес:${productFields.properties.product_address}<p>
        <p>Описание:${productFields.product_description}<p>
    `)
}