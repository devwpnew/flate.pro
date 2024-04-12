export default function emailConfirmationTemplate(code, emailTo){
    return (`
        Приветствуем, ${emailTo}!\r\n
        <br/>\r\n<br/>\r\n
        Для подтверждения вашей почты на сайте flate.pro, пройдите по ссылке <a href=https://flate.pro/user/profile/email_confirmation?code=${code}>https://flate.pro/user/profile/email_confirmation?code=${code}</a>\r\n
        <br/>\r\n<br/>\r\n
        С наилучшими пожеланиями,\r\n
        команда сайта.\r\n
    `)
}