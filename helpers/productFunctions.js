import API from "pages/api/service/api";
import FormData from "form-data";
import CyrillicToTranslit from 'cyrillic-to-translit-js';
const cyrillicToTranslit = new CyrillicToTranslit();

export async function reGenerateProductName(product) {
    if (!product) {
        return { error: 'Товар обязателен' }
    }
    const getProd = (typeof product == 'object' ? product : await API.get.product.byID(product))
    const checkName = await generateProductName(getProd)
    if (checkName != getProd.name) {
        const res = await API.update.product({ id: getProd.id, name: checkName })
        return res
    } else {
        return 'Имя не изменилось'
    }
}

export async function reGenerateProductCode(product) {
    if (!product) {
        return { error: 'Товар обязателен' }
    }
    const getProd = (typeof product == 'object' ? product : await API.get.product.byID(product))
    const checkName = await generateProductName(getProd)
    const checkCode = textToCode(checkName)
    const code = checkCode + `-${getProd.id}`
    if (code != getProd.slug) {
        const res = await API.update.product({ id: getProd.id, slug: code })
        return res
    } else {
        return 'Имя не изменилось'
    }
}

export async function reGenerateProductImage(product) {
    if (!product) {
        return { error: 'Товар обязателен' }
    }
    const getProd = (typeof product == 'object' ? product : await API.get.product.byID(product))
    const checkImage = await generateProductImage(getProd)
    if (checkImage && getProd.image != checkImage) {
        const res = await API.update.product({ id: getProd.id, image: checkImage })
        return res
    } else {
        return 'Изображение не изменилось'
    }
}

export async function generateProductName(data) {
    try {
        if (data instanceof FormData || typeof data == 'object') {
            let rcId = false
            let sectionId = false
            let livingSquare = false
            let landSquares = false
            let propProdAdress = false
            let roomCountId = false
            let floor = false
            let house_types = false
            let defaultName = false

            if (data instanceof FormData) {
                rcId = data.get('rc_link');
                sectionId = data.get('section_relation')
                livingSquare = data.get('living_squares')
                landSquares = data.get('land_squares')
                if(data.get('building_address')) {
                    propProdAdress = data.get('building_address')
                } else if (data.get('building_link')) {
                    const buildingObject = await API.get.buildings({filter: {id: data.get('building_link')}, limit: 1});
                    propProdAdress = buildingObject.name;
                } else if (data.get('pre_name')) {
                    propProdAdress = data.get('pre_name');
                } else {
                    propProdAdress = data.get('property_product_address')
                }
                roomCountId = data.get('product_room_count')
                floor = data.get('property_product_floor')
                house_types = data.get('house_types')
                defaultName = data.get('name')
            } else {
                rcId = data?.rc_link?.id
                sectionId = data?.section_relation.map((section) => { return section.id })
                livingSquare = data?.living_squares
                landSquares = data?.land_squares
                if(data?.building_address) {
                    propProdAdress = data.building_address
                } else if (data?.building_link) {
                    const buildingObject = await API.get.buildings({filter: {id: data.building_link.id}, limit: 1});
                    propProdAdress = buildingObject.name;
                } else if (data?.pre_name) {
                    propProdAdress = data.pre_name;
                } else {
                    propProdAdress = data?.properties?.product_address
                }
                roomCountId = data.product_room_count
                floor = data?.properties?.product_floor
                house_types = data?.house_types
                defaultName = data.name
            }

            let newName = '';

            let strLandSquares = landSquares
            if (landSquares) {
                if ((landSquares % 100 < 10 || landSquares % 100 > 20) && landSquares % 10 == 1) {
                    strLandSquares += ' сотка'
                } else if ((landSquares % 100 < 10 || landSquares % 100 > 20) && landSquares % 10 >= 2 && landSquares % 10 <= 4) {
                    strLandSquares += ' сотки'
                } else {
                    strLandSquares += ' соток'
                }
            }

            if (sectionId == 3 || (Array.isArray(sectionId) && sectionId.includes(3))) { // Квартиры
                if (rcId) {
                    const arrRc = await API.get.rcs({ filter: { id: rcId }, limit: 1 })
                    if (arrRc) {
                        newName += `${arrRc['name']},`
                    }
                } else {
                    if (propProdAdress) {
                        newName += `${propProdAdress},`;
                    }
                }

                if (livingSquare) {
                    if (newName != '') {
                        newName += ' '
                    }
                    newName += `${livingSquare} м²`
                }

                if (roomCountId || roomCountId === 0) {
                    const roomCountField = await API.get.fieldInfo('product', 'product_room_count')
                    const roomCountValue = roomCountField.descObj.result_options[roomCountId]

                    if(roomCountValue == "Свободная планировка") {
                        newName += ', Своб. планировка'
                    } else {
                        newName += `, ${roomCountValue}`
                        newName += Number(roomCountValue) ? '-комн.' : ''
                    }
                }

                if (floor) {
                    newName += `, ${floor} этаж`
                }
            } else if (sectionId == 4 || (Array.isArray(sectionId) && sectionId.includes(4))) { // Дома
                const house_typesFields = await API.get.fieldInfo('product', 'house_types')
                const house_typesValue = house_typesFields.descObj.result_options[house_types]

                newName += house_typesValue ? house_typesValue : ' Дом'

                if (livingSquare) {
                    newName += ` ${livingSquare} м²`
                }

                if (floor) {
                    newName += `, ${floor} этаж`
                }

                if (strLandSquares) {
                    newName += `, ${strLandSquares}`
                }
            } else if (sectionId == 5 || (Array.isArray(sectionId) && sectionId.includes(5))) { // Земля
                newName = `Земельный участок`

                if (strLandSquares) {
                    newName += `, ${strLandSquares}`
                }
            }

            return newName == '' ? defaultName : newName;
        } else {
            return { error: 'No data' }
        }
    } catch (error) {
        return {error}
    }
}

export async function generateProductImage(product) {
    try {
        const currentImage = product.image;
        if (product?.properties?.product_galery) {
            const galery = JSON.parse(product.properties.product_galery);
            if (galery.includes(currentImage)) {
                return currentImage;
            } else {
                return galery[0]
            }
        } else {
            return null
        }
    } catch (e) {
        return { error: e }
    }
}

export async function checkproductPremium(product) {
    try {
        const prod = (typeof product == 'object' ? product : await API.get.product.byID(product))
        if(prod.premium != 0 && prod.date_paid == null) {
            const res = await API.update.product({id: prod.id, date_paid: new Date()})
            return res
        } else {
            return "Премиум статус не изменился"
        }
    } catch (e) {
        return (e)
    }
}

export async function regenerateProductInfo(prod) {
    try {
        if(!prod) {
            return {Error: "ID или объект товара обязателен"}
        }
        const res = {};

        res.name = await reGenerateProductName(prod);
        res.slug = await reGenerateProductCode(prod);
        res.image = await reGenerateProductImage(prod);
        res.prem = await checkproductPremium(prod);

        return res
    } catch (e) {
        return {Error: e}
    }
}

export function textToCode (name, changeRegister = false){

    if(changeRegister) {
        name = name.toLowerCase()
    }

    const nameTranslit = cyrillicToTranslit.transform(name, '-');

    let rep = nameTranslit.replaceAll('.', '-')
    rep = rep.toLowerCase()
    rep = rep.replaceAll(',', '-')
    rep = rep.replaceAll('/', '-')
    rep = rep.replaceAll('"', '-')
    rep = rep.replaceAll('\'', '-')
    rep = rep.replaceAll('«', '-')
    rep = rep.replaceAll('»', '-')
    rep = rep.replaceAll('²', '2')

    while(rep.indexOf('--') + 1){
        rep = rep.replaceAll('--', '-')
    }

    return rep
}