import api from "pages/api/service/api";

import { useSelector } from "react-redux";

import SEO from "@modules/common/components/seo/seo";
import HelpTemplate from "@modules/user/components/help/template/helpTemplate";

import useUser from "hooks/useUser";

export default function Help({ data }) {
  const user = useUser(data.user);

  return (
    <>
      <SEO
        title={`Помощь по сайту – база объявлений FLATE.PRO`}
        description={`Помощь по сайту объявлений FLATE.PRO – площадка объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи.`}
      />
      <HelpTemplate user={user} />
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res } = context;

  const user = await api.auth.isUserAuthorized(req, res);

  return { props: { data: { user } } };
}
