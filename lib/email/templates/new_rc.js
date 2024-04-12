export default function NewRcTemplate(rcFields){
    return (`
        Новая заявка на добавление ЖК ${rcFields.name} ${rcFields.address}. Пожалуйста зайдите в админку, одобрите или отклоните.
    `)
}