import axios from "axios";

export async function isUserAuthorizedAxios(host) {
    const res = await axios.post(
        `${host ? host : "https://flate.pro"}/api/admin_api/authFunctions`,
        {function: "isUserAuthorized"},
    );
    return res.data
}