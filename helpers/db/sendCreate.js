import axios from "axios";

export async function sendCreate(sendData, domen) {
  try {
    const sendCreateRequest = await axios.post(`${domen}/api/admin_api/create`, sendData, { headers: { 'Content-Type': 'multipart/form-data'} } )
    return sendCreateRequest;
  } catch (error) {
    console.log(error.response);
    // return error.response;
  }
}