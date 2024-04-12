import axios from "axios"
import FormData from "form-data";
import { createAxiosPostRequest } from "helpers/modelHelper";
let domen = false;

const imagesModel = {
    upload: async (file, host = false) => {
        try {
            if(typeof file != "object") {
                return {error: 'Должен быть объектом'}
            }
            if (host) {
                domen = host;
            } else if (typeof window != 'undefined') {
                domen = window.location.origin;
            }
            const formData = new FormData();
            // console.log('file', typeof file, file)
            formData.append('file', file)
            const res = await axios.post(
                `${domen ? domen : "https://flate.pro"}/api/v2/upload`,
                formData,
                { headers: {'Content-Type': 'multipart/form-data;'} }
            )
            return res.data
        } catch (e) {
            console.error(e)
            return {error: e}
        }
    },
    createFromPath: async (path, host = false) => {
        const response = await createAxiosPostRequest('/api/v2/image/addFromPath', { path }, host)
        return response
    },
    publish: async (id, host) => {
        try {
            if (host) {
                domen = host;
            } else if (typeof window != 'undefined') {
                domen = window.location.origin;
            }
            const res = await axios.post(
                `${domen ? domen : "https://flate.pro"}/api/admin_api/image`,
                {function: 'publish', id},
            )
            return res.data
        } catch (e) {
            console.error(e)
            return {error: e}
        }
    },
}
export default imagesModel