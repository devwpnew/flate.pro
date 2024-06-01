import api from "pages/api/service/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";


import logo from "public/logo.svg";

import CategoryTemplate from "@modules/posts/type/category/template/categoryTemplate";

import useUser from "hooks/useUser";
import FourOhFour from "pages/404";
import SEO from "@modules/common/components/seo/seo";

import declension from "helpers/formatters/declension";

export default function User({ data }) {
  const user = useUser(data.user, "/user/profile/auth");

  const userLink = data.userLink;
  const userPage = userLink && userLink[0];
  const userId = userLink && userLink[0]?.id;

  let ogDescriptionFull = `${data.user_products_count?.count > 0 ? data.user_products_count.count : '0'} ${declension(
    data.user_products_count?.count,
    ["объявление", "объявления", "объявлений"]
  )} от пользователя ${userPage.user_name}`;

  if (userLink?.user_agency) {
    ogDescriptionFull + `, Агенство: ${userPage.user_agency}`;
  }

  if (userLink?.user_description) {
    ogDescriptionFull += `, О себе: ${userPage.user_description}`;
  }

  return !userId ? (
    <FourOhFour></FourOhFour>
  ) : (
    <>
      <SEO
        title={`Освобождаем время, повышаем ваши продажи`}
        description={ogDescriptionFull}
        descriptionFull={ogDescriptionFull}
        url={"https://flate.pro/users/" + userPage?.sef_code || userPage.id}
        image={logo.src}
      />

      <CategoryTemplate
        isRow={true}
        section={{ name: "userId" }}
        userLink={userLink && userLink[0]}
        userId={userId && userId}
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

  const isSlug = parseInt(id);

  const queryParams = {
    window_host: window_host,
    filter: {},
    sort: {
      id: "asc",
    },
    limit: "all",
  };

  if (isNaN(isSlug)) {
    queryParams["filter"]["sef_code"] = id;
  } else {
    queryParams["filter"]["id"] = id;
  }

  const userLink = await api.get.user(queryParams);

  if (!userLink) {
    return {
      notFound: true,
    };
  }

  const data = {};

  if (user) {
    data["user"] = user;
  }

  if (userLink) {
    data["userLink"] = userLink;

    const ssrProductsCount = await api.get.product.count({
      window_host: window_host,
      user_id: userLink[0].id,
      published: 1,
    });

    data["user_products_count"] = ssrProductsCount;
  } else {
    return {
      notFound: true,
    };
  }

  return { props: { data } };
}
