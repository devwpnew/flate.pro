import axios from "axios";
import useUser from "hooks/useUser";
import api from "pages/api/service/api";

import { useEffect, useState } from "react";

export default function TestAdminIndex(data) {

  const [result, setResult] = useState();

  useUser(data.user);

  useEffect(() => {  
    (async () => {
      // const test = await api.add.pushMessageByUser('tit', 'txt', 89)
      // setResult(test)
      // console.log({test})
    })();
  }, []);

  return (
    <>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
}

export async function getServerSideProps(context) {
  // export async function getServerSideProps({ req, res }) {
  const req = context.req;
  const res = context.res;

  let data = {};
  data.tables = [];

  // data.page = context?.query?.page;
  require("dotenv").config();

  const userAuthorized = await api.auth.isUserAuthorized(req, res);

  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ipModified = ip == "::1" ? "127.0.0.1" : ip;

  data.domen = process.env.DOMEN;
  data.ip = ipModified;
  data.userAgent = req.headers["user-agent"];

  if (userAuthorized && !userAuthorized.error) {
    data.user = userAuthorized;

  } else {
    data.user = false;
  }
  return { props: data };
}
