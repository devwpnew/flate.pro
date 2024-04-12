import axios from "axios";

let domen = 'http://localhost:3000'

export async function createAxiosPostRequest(relativePath, fields, host) {
    if (host) {
        domen = host;
    } else if (typeof window != 'undefined') {
        domen = window.location.origin;
    }
    const request = await axios.post(`${domen}${relativePath}`, fields)
    return request?.data
}