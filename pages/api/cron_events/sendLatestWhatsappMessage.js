const axios = require('axios');

// Конфигурация запроса
const url = 'https://suzdalini.flate.pro/messages/send/latest';
const token = '789hghj23sdfsdfsadfhghHDSFJho7y8tugfisdu9f';

// Функция для отправки POST запроса
const sendPostRequest = async () => {
    try {
        const response = await axios.post(url, {
            token: token
        });
        console.log('Request sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending request:', error);
    }
};

// Выполнение функции
sendPostRequest();