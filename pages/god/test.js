import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import axios from "axios";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import api from "pages/api/service/api";

import { useEffect, useState } from "react";

export default function TestAdminIndex(data) {

  const router = useRouter();

  useUser(data.user);

  const testFunction = async () => {
    // const test = await imagesModel.createFromPath('http://localhost:3000/_next/static/media/logo.6b861529.svg')
    

  }

  useEffect(() => {
    (async () => {

      // console.log('num', usersModel.defaultLimit)

      // const filter = {
      //   id: {
      //     from: 900
      //   }
      // }

      // const sort = {id: 'ASC'}

      // const limit = 30;

      // const page = 1;

      // const test = await usersModel.getAdminList(filter, sort, limit, page);

      // console.log({test})
      // const test = await selectionModel.countForUser(89)
      // console.log('test', test)
      // const test = await axios.post('https://flate.pro/api/v2/selection_product/add', {
      //   fields: {
      //     name: 'test',
      //     selection: 88,
      //     product_id: 1
      //   }
      // })
      // console.log({test})
    })();
  }, []);

  return (
    <Container>
      <Button onClick={testFunction}>test</Button>
    </Container>
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
