import API from "pages/api/service/api";
import SEO from "@modules/common/components/seo/seo";
import PostTemplate from "@modules/posts/type/post/postTemplate";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import useUser from "hooks/useUser";
import { getCookie, setCookie } from "cookies-next";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import getProductPrice from "helpers/formatters/product/getProductPrice";

function Post({ data }) {
  const user = useUser(data.user);
  const product = data.ssrProduct;
  const section = data.ssrSection
  

  // console.log(user);

  return (
    <>
      <SEO
        title={product.name || product.meta_title}
        description={product.name || product.meta_description}
        descriptionFull={product.product_price ? getProductPrice(product) + ' руб' : false}
        image={getProductImageSrc(product)}
        url={"https://flate.pro" + getProductUrl(product)}
        price={product.product_price}
      />
      <PostTemplate product={product} />
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res } = context;
  const { section_slug, product_slug } = context.query;
  const window_host = process.env.DOMEN;

  const userRequest = await API.auth.isUserAuthorized(req, res);
  const user = userRequest ? userRequest : {};

  const ssrSection = await API.get.sections({
    window_host: window_host,
    sort: {
      id: "asc",
    },
    filter: { slug: section_slug },
  });

  const ssrProduct = await API.get.product.list({
    window_host: window_host,
    filter: {
      section_relation: ssrSection.id,
      published: "1",
      slug: product_slug,
    },
    limit: 1,
    sort: { sort: "ASC" },
  });

  if (!ssrSection) {
    return {
      notFound: true,
    };
  }

  if (!ssrProduct) {
    return {
      notFound: true,
    };
  }

  let cookieSeenProds = getCookie("products_viewed", { req, res });

  if (!cookieSeenProds) {
    cookieSeenProds = [];
  } else if (!Array.isArray(cookieSeenProds)) {
    cookieSeenProds = JSON.parse(cookieSeenProds);
  }

  if (!cookieSeenProds.includes(ssrProduct.id)) {
    const updateCount = await API.update.productViewCount(
      ssrProduct,
      window_host
    );
    
    if (updateCount) {
      cookieSeenProds.push(ssrProduct.id);
      setCookie("products_viewed", cookieSeenProds, {
        req,
        res,
        maxAge: 24 * 60 * 60, // Раз в сутки
        // maxAge: 30 * 24 * 60 * 60, // Раз в месяц
        path: "/",
      });
    }
  }

  const props = {
    data: {
      ssrSection,
      ssrProduct,
      user,
    },
  };

  return { props };
}

export default Post;
