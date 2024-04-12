import axios from "axios";

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getData(fields, domen = false) {
  try {
    if (!domen) {
      require('dotenv').config()
      domen = process.env.DOMEN;
    }

    const res = await axios.post(
      `${domen}/api/admin_api/getList`,
      fields
    );

    const data = res.data;
    return data;
  } catch (error) {
    console.error(error.response);
  }
}

export async function getList(props, domen = false) {
  const response = await getData(props, domen);

  if (response) {
    return response;
  }
}
