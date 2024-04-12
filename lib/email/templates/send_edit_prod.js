export default function SendEditProdTemplate(arProduct, textWhy){
    return (`
        <p>ID: ${arProduct.id}</p>
        <p>${textWhy}</p>
    `)
}