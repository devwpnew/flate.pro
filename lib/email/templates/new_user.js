export default function NewUserNotifTemplate(data){
    // console.log({template: user})
    const user = data.user
    const registeredFrom = data.registeredFrom
    return (`
        <p style="font-size: 24px">Зарегестрировался пользователь с ID: ${user.id}</p>
        <p style="marign-top: 30px; font-size: 16px">
            <span style="font-weight: 600">Регистрация через:</span>
            <span style="font-weight: 400">${registeredFrom}</span>
        </p>
        <p style="font-size: 16px">
            <span style="font-weight: 600">Телефон:</span>
            <span style="font-weight: 400">${user.phone}</span>
        </p>
        <p style="font-size: 16px">
            <span style="font-weight: 600">ФИО:</span>
            <span style="font-weight: 400">${user.user_name} ${user.user_last_name}</span>
        </p>
        <p style="font-size: 16px">
            <span style="font-weight: 600">Название агентства:</span>
            <span style="font-weight: 400">${user.user_agency}</span>
        </p>
        <p style="font-size: 16px">
            <span style="font-weight: 600">Город:</span>
            <span style="font-weight: 400">${user.default_city.name}</span>
        </p>
        <p style="font-size: 16px">
            <span style="font-weight: 600">О себе:</span>
            <br/>
            <span style="font-weight: 400">${user.user_description}</span>
        </p>
        <p style="font-size: 16px">
            <span style="font-weight: 600">Подтверждение проф. деятельности:</span>
            <br/>
            <span style="font-weight: 400">${user.professional_confirmation.replaceAll('\r\n', '<br/>')}</span>
        </p>
    `)
}