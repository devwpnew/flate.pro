import api from "pages/api/service/api";

import CategoryTemplate from "@modules/posts/type/category/template/categoryTemplate";

import useUser from "hooks/useUser";
import FourOhFour from "pages/404";
import SEO from "@modules/common/components/seo/seo";
import { useEffect } from "react";

export default function Rc({ data }) {
  const user = useUser(data.user, "/user/profile/auth");
  const building = data?.building[0];

  return !building ? (
    <FourOhFour></FourOhFour>
  ) : (
    <>
      {/* <SEO
        title={rcPage.name}
        description={`Объявления в ${rcPage.name}`}
        descriptionFull={rcPage.description}
        url={"https://flate.pro/rc/" + rcPage.id}
      /> */}
      <CategoryTemplate
        isRow={true}
        section={{ name: building.name }}
        buildingLink={building && building}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const window_host = process.env.DOMEN;
  const { req, res } = context;
  const { id } = context.query;
  const user = await api.auth.isUserAuthorized(req, res);

  const data = {};

  const building = await api.get.buildings({
    window_host: window_host,
    filter: {
      id: id,
    },
    sort: {
      id: "asc",
    },
  });

  if (user) {
    data["user"] = user;
    data["building"] = building;
  }

  return { props: { data } };
}
