import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@modules/common/components/container/container";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import AddTemplate from "@modules/user/components/add/template/addTemplate";

import { isUserAuthorized } from "pages/api/user/auth";
import useUser from "hooks/useUser";
import api from "pages/api/service/api";
import SEO from "@modules/common/components/seo/seo";
export default function Add({ data }) {
  const router = useRouter();

  const user = useUser(data.user, "/user/profile/auth");

  // useEffect(() => {
  //   if (user && user.user_group?.id !== 1 && user.user_group?.id !== 5) {
  //     router.push("/user/profile/auth");
  //   }
  // }, [router, user]);

  return (
    <>
      <SEO
        title={`Размещение объявления на сайте – база объявлений FLATE.PRO`}
        description={`Размещение объявления на сайте FLATE.PRO – площадки объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи.`}
      />
      {user ? (
        <AddTemplate user={user} />
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
