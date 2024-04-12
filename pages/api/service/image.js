import axios from "axios"
import FormData from "form-data";
let domen = false;

let image = {}
export default image = {
    upload: async function imageUpload(file, window_host = false) {
        try {
            if(typeof file != "object") {
                return {error: 'Должен быть объектом'}
            }
            if (window_host) {
                domen = window_host;
            } else if (typeof window != 'undefined') {
                domen = window.location.origin;
            }
            const formData = new FormData();
            // console.log('file', typeof file, file)
            formData.append('file', file)
            const res = await axios.post(
                `${domen ? domen : "https://flate.pro"}/api/admin_api/upload`,
                formData,
                { headers: {'Content-Type': 'multipart/form-data;'} }
            )
            return res.data
        } catch (e) {
            console.error(e)
            return {error: e}
        }
    },
    publish: async function imagePublish(id, window_host) {
        try {
            if (window_host) {
                domen = window_host;
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
    }
}