import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useRouter } from "next/router";
import AuthTemplate from "@modules/user/components/auth/template/authTemplate";
import LoginTemplate from "@modules/user/components/auth/template/loginTemplate";

import { isUserAuthorized } from "pages/api/user/auth";

import getLayout from "helpers/getLayout";
import useUser from "hooks/useUser";
import api from "pages/api/service/api";
import SEO from "@modules/common/components/seo/seo";

export default function Auth({ data }) {
  const { DESKTOP } = getLayout();
  const user = useUser(data.user);
  const router = useRouter();

  useEffect(() => {
    function popHandler(event) {
      event.preventDefault();
      
      router.push('/')
    }

    window.addEventListener("popstate", popHandler);

    return () => {
      window.removeEventListener("popstate", popHandler);
    };
  }, []);

  return (
    <>
      <SEO
        title={`Авторизация на FLATE.PRO | Вход в ваш аккаунт`}
        description={`Войдите в свой аккаунт на FLATE.PRO для доступа к персональным предложениям и управления вашими объявлениями о недвижимости в Сочи.`}
      />
      {DESKTOP ? <LoginTemplate data={data} /> : <LoginTemplate data={data} />}
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  require("dotenv").config();

  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ipModified = ip == "::1" ? "127.0.0.1" : ip;

  const user = await api.auth.isUserAuthorized(req, res);

  return {
    props: {
      data: {
        ip: ipModified,
        DOMEN: process.env.DOMEN,
        user: user,
        userAgent: req.headers["user-agent"],
      },
    },
  };
}
