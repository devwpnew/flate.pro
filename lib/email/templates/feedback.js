export default function feedbackTemplate(data){
    return (`
        <p>Причина: ${data?.text_why}<p>
        <p>Идея: ${data?.text_idea}<p>
        <p>Рейтинг: ${data?.vote}<p>
        ${data.contact ? '<p>Контакт:'+data.contact+'<p>': ''}
    `)
    // <p>Оценка: ${data?.vote}<p>
}