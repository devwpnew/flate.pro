import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { useSelector } from "react-redux";

const SEO = ({
  title,
  description,
  descriptionFull,
  url,
  image,
  price,
  categoryName,
}) => {
  const activeCity = useSelector((state) => state.userCity.value);

  // title = title?.replace("#CITY_NAME#", activeCity.name);
  // description = description?.replace("#CITY_NAME#", activeCity.name);

  descriptionFull = descriptionFull?.replace(/(<([^>]+)>)/gi, "");

  // console.log(description);
  return (
    <Head>
      <title>{title}</title>

      {/* Meta tags */}
      <meta property="title" content={title} />
      <meta itemProp="name" content={title} />
      <meta name="description" content={description} />
      <meta itemProp="description" content={description} />
      <meta name="yandex-verification" content="32d6ad7d80c69f49" />

      {/* Open Graph tags */}

      <meta property="og:site_name" content="FLATE — бизнес-ассистент агента" />
      <meta property="og:locale" content="ru_ru"></meta>

      {title && <meta property="og:title" content={title} />}
      {descriptionFull && (
        <meta property="og:description" content={descriptionFull} />
      )}
      {categoryName && (
        <meta property="product:category" content={categoryName} />
      )}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      {price ? (
        <>
          <meta property="og:type" content="product" />
          <meta property="og:price:amount" content={price} />
          <meta property="og:price:currency" content="RUB" />
        </>
      ) : (
        <meta property="og:type" content="website" />
      )}
    </Head>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default SEO;
