import axios from "axios";

export async function sendEdit(sendData, domen) {
  try {
    const sendEditRequest = await axios.post(`${domen}/api/admin_api/edit`, sendData, { headers: { 'Content-Type': 'multipart/form-data'} } )
    return sendEditRequest;
  } catch (error) {
    console.log(error.response);
  }
}