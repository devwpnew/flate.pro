import API from "pages/api/service/api";
import SEO from "@modules/common/components/seo/seo";
import CategoryTemplate from "@modules/posts/type/category/template/categoryTemplate";

import useUser from "hooks/useUser";
import FourOhFour from "pages/404";

export default function IndexCategory({ data }) {
  const user = useUser(data.user, "/user/profile/auth");

  const section = data?.ssrSection;
  const sectionId = section?.id;

  const name = section?.meta_h1;
  const metaTitle = section?.meta_title;
  const metaDescription = section?.meta_description;

  return (
    <>
      <SEO
        title={metaTitle || name}
        description={metaDescription || name}
        url={"https://flate.pro/posts/" + section.slug}
        categoryName={section.name}
      />
      <CategoryTemplate
        user={user}
        // ssrPremiumProductsCount={data?.ssrPremiumProductsCount}
        // ssrPremiumProducts={data?.ssrPremiumProducts}
        // ssrProductsCount={data?.ssrProductsCount}
        // ssrProducts={data?.ssrProducts}
        sectionId={sectionId}
        section={data?.ssrSection}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { section_slug } = context.query;
  const { req, res } = context;
  const window_host = process.env.DOMEN;

  const userRequest = await API.auth.isUserAuthorized(req, res);
  const user = userRequest ? userRequest : {};
  const userDefaultCity = user?.default_city;

  const ssrSection = await API.get.sections({
    window_host: window_host,
    sort: {
      id: "asc",
    },
    filter: { slug: section_slug },
    limit: 1,
  });

  if (!ssrSection) {
    return {
      notFound: true,
    };
  }

  // const productsParams = {
  //   sort: { date_sort: "DESC" },
  //   filter: { published: 1, section_relation: ssrSection?.id },
  //   limit: 20,
  //   page: 0,
  // };

  // const productsPremiumParams = {
  //   sort: { stat_views: "DESC" },
  //   filter: {
  //     published: 1,
  //     premium: "!false",
  //     section_relation: ssrSection.id,
  //   },
  //   limit: 4,
  //   page: 0,
  // };

  // if (userDefaultCity) {
  //   productsParams["filter"]["city_link"] = userDefaultCity;
  //   productsPremiumParams["filter"]["city_link"] = userDefaultCity;
  // }

  // const ssrPremiumProductsCount = await API.get.product.count({
  //   window_host: window_host,
  //   published: 1,
  //   premium: "!false",
  // });
  // const ssrPremiumProducts = await API.get.product.list({
  //   window_host: window_host,
  //   ...productsPremiumParams,
  // });

  // const ssrProductsCount = await API.get.product.count({
  //   window_host: window_host,
  //   published: 1,
  // });
  // const ssrProducts = await API.get.product.list({
  //   window_host: window_host,
  //   ...productsParams,
  // });

  const props = {
    data: {
      ssrSection,
      // ssrPremiumProductsCount,
      // ssrPremiumProducts,
      // ssrProductsCount,
      // ssrProducts,
      user,
    },
  };

  return { props };
}
