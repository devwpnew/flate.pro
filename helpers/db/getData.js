import axios from "axios";

export async function getData(fields) {
  try {
    require('dotenv').config()
    const domen = process.env.DOMEN;

    const res = await axios.post(
      `${domen}/api/admin_api/getList`,
      fields
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error); // this is the main part. Use the response property from the error object
    // return error.response;
  }
}