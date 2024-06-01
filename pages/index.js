import API from "pages/api/service/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import SEO from "@modules/common/components/seo/seo";
import HomeTemplate from "@modules/layout/components/homeTemplate";

import { useDispatch } from "react-redux";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";

import useUser from "hooks/useUser";
import { useRouter } from "next/router";

export default function Home({ data }) {
  const router = useRouter();
  const user = useUser(data.user, "/user/profile/auth");
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.pathname === "/") {
      dispatch(setFilterGlobalFields({}));
    }
  }, [router]);

  return (
    <>
      <SEO
        title={`Купить или продать недвижимость в городе Сочи – сайт недвижимости FLATE.PRO`}
        description={`Доска объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи. Объявления от частных лиц, застройщиков и агентств недвижимости. На FLATE.PRO вы сможете недорого купить квартиру, дом или землю в Сочи. Выгодные цены на недвижимость в Сочи.`}
      />
      <HomeTemplate
        user={user}
        ssrNews={data.ssrNews}
        ssrPremiumProducts={data?.ssrPremiumProducts}
        ssrPremiumProductsCount={data.ssrPremiumProductsCount}
        ssrProducts={data.ssrProducts}
        ssrProductsCount={data.ssrProductsCount}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res } = context;
  const window_host = process.env.DOMEN;

  const userRequest = await API.auth.isUserAuthorized(req, res);
  const user = userRequest ? userRequest : {};
  const userDefaultCity = user?.default_city;

  const productsParams = {
    sort: { date_sort: "DESC" },
    filter: { published: 1 },
    limit: 20,
    page: 1,
  };

  const productsPremiumParams = {
    sort: { stat_views_preview: "ASC" },
    filter: {
      published: 1,
      premium: "!false",
    },
    limit: 4,
    page: 1,
  };

  if (userDefaultCity) {
    productsParams["filter"]["city_link"] = userDefaultCity.id;
    productsPremiumParams["filter"]["city_link"] = userDefaultCity.id;
  }

  const ssrPremiumProductsCount = await API.get.product.count({
    window_host: window_host,
    published: 1,
    premium: "!false",
  });

  const ssrPremiumProducts = await API.get.product.list({
    window_host: window_host,
    ...productsPremiumParams,
  });

  const ssrProductsCount = await API.get.product.count({
    window_host: window_host,
    published: 1,
  });
  const ssrProducts = await API.get.product.list({
    window_host: window_host,
    ...productsParams,
  });

  const ssrNews = await API.get.news({
    window_host: window_host,
    limit: 2,
    filter: { published: true },
    sort: { date_created: "DESC" },
  });

  const data = {};

  if (ssrNews) {
    data["ssrNews"] = ssrNews;
  }

  if (ssrPremiumProducts) {
    data["ssrPremiumProducts"] = ssrPremiumProducts;
    data["ssrPremiumProductsCount"] = ssrPremiumProductsCount;
  }

  if (ssrProducts) {
    data["ssrProducts"] = ssrProducts;
    data["ssrProductsCount"] = ssrProductsCount;
  }

  if (user) {
    data["user"] = user;
  }

  const props = {
    data: { ...data },
  };

  return { props };
}
