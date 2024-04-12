import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@modules/common/components/container/container";
import SubscribeTemplate from "@modules/user/components/subscribe/template/subscribeTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import { isUserAuthorized } from "pages/api/user/auth";
import useUser from "hooks/useUser";
import api from "pages/api/service/api";
import SelectionsTemplate from "@modules/user/components/selections/template/selectionsTemplate";

export default function Selections({ data }) {
  const user = useUser(data.user, "/user/profile/auth");


  return (
    <>
      {user ? (
        <SelectionsTemplate />
      ) : (
        <Container>
          <div className="flex flex-row items-center justify-center h-full">
            <PreloaderSpinner />
          </div>
        </Container>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res } = context;

  const user = await api.auth.isUserAuthorized(req, res);

  return { props: { data: { user } } };
}
