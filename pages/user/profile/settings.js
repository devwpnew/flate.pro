import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@modules/common/components/container/container";
import SettingsTemplate from "@modules/user/components/settings/template/settingsTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import useUser from "hooks/useUser";
import api from "pages/api/service/api";
export default function Settings({ data }) {
  const user = useUser(data.user, "/user/profile/auth");


  return (
    <>
      {user ? (
        <SettingsTemplate customUser={user} />
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
  
  let user = await api.auth.isUserAuthorized(req, res);

  return { props: { data: { user } } };
}
