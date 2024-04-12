import api from "pages/api/service/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";

import UserAvatar from "@modules/user/components/profile/common/userAvatar";
import UserName from "@modules/user/components/profile/common/userName";

import Preloader from "@modules/common/components/preloader/preloader";
import PostGallery from "./parts/gallery/postGallery";
import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import SearchForm from "@modules/search/components/searchForm";
import PostTopBar from "./parts/postTopBar";
import BackButton from "@modules/common/components/button/backButton";
import PostDescription from "./parts/postDescription";
import getLayout from "helpers/getLayout";
import PostJkInfo from "./parts/postJkInfo";
import PostYandexMap from "./parts/postYandexMap";
import PostProperties from "./parts/postProperties";
import PostHeader from "./parts/postHeader";
import PostViewed from "./parts/postViewed";
import PostSidebar from "./parts/postSidebar";
import ButtonMessage from "@modules/common/components/button/buttonMessage";
import ButtonCall from "../../../common/components/button/buttonCall";
import PostFooter from "./parts/postFooter";
import PostRelated from "./parts/postRelated";

import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductPriceSquares from "helpers/formatters/product/getProductPriceSquares";
import getProductDate from "helpers/formatters/product/getProductDate";
import getProductPhone from "helpers/formatters/product/getProductPhone";
import declension from "helpers/formatters/declension";

import useProductsCount from "hooks/products/useProductsCount";

export default function PostTemplate({ product }) {
  const router = useRouter();
  const userProductsCount = useProductsCount(
    useMemo(() => {
      return {
        user_id: product.user_id.id,
        published: "1",
      };
    }, [])
  );

  const gal = product?.properties?.product_galery?.split(",");
  // const gal = product?.gallery_v2 ? product.gallery_v2 : product?.properties?.product_galery?.split(",");

  const { MOBILE, LAPTOP_MOBILE, DESKTOP, VARIANTS } = getLayout();

  const backButtonHandler = () => {
    const previousPageUrl = document.referrer;
    if (previousPageUrl === "") {
      router.push("/");
    } else {
      const finalSlashIndex = router.asPath.lastIndexOf("/");
      const previousPath = router.asPath.slice(0, finalSlashIndex);
      router.push(previousPath);
      window.close();
    }
  };

  const slug = product?.section_relation[0]?.slug;

  return (
    <>
      {/* START POST */}
      <MotionContainer
        variants={VARIANTS}
        className={
          !DESKTOP
            ? "bg-white w-full h-screen fixed top-0 left-0 z-50 overflow-scroll pb-20 translate-x-full"
            : ""
        }
      >
        <div className="bg-greylight py-4 border-b-[1px] border-greyborder">
          <div className="mx-auto container px-[15px] ">
            <div className="flex items-center justify-between">
              {!DESKTOP && (
                <BackButton onClick={backButtonHandler} className="pr-4" />
              )}
              {LAPTOP_MOBILE ? (
                <div className="w-[90%] md:w-full">
                  <PostTopBar
                    product_name={product.name}
                    rcLink={product.rc_link}
                    product_id={product.id}
                  />
                </div>
              ) : (
                <SearchForm />
              )}
            </div>
          </div>
        </div>

        <Container className="mb-5 md:mb-10 lg:flex lg:justify-between lg:container lg:mx-auto lg:gap-5 items-start relative mt-2">
          <div className="lg:max-w-[800px] w-full">
            {/* START GALLERY MOBILE */}
            {MOBILE && gal && (
              <PostGallery previewImage={gal[0]} galleryImages={gal} />
            )}
            {/* END GALLERY MOBILE */}

            {/* <div className="hidden md:flex items-center gap-2 text-sm py-5">
                <Image src={mapIcon.src} width={12} height={15} />
                {getProductAddress(product)}
              </div> */}

            {/* START HEADER */}
            <PostHeader product={product} />
            {/* END HEADER */}

            {/* START GALLERY DESKTOP */}
            {!MOBILE && gal && (
              <PostGallery previewImage={gal[0]} galleryImages={gal} />
            )}
            {/* END GALLERY DESKTOP */}

            {!DESKTOP && (
              <>
                <div className="flex flex-col gap-1 mb-2 md:mb-5">
                  <span className="text-primary text-2xl font-bold">
                    {getProductPrice(product)} руб.
                  </span>
                  <span>
                    {getProductPriceSquares(product)} руб. за{" "}
                    {slug && slug === "land"
                      ? "сотку"
                      : "м2"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2.5 mb-2 md:mb-5">
                  {product?.messages_calls === "0" && (
                    <>
                      <div className="h-10 w-full">
                        <ButtonCall
                          type="white"
                          showIcon={true}
                          phone={getProductPhone(product)}
                        />
                      </div>
                      <div className="h-10 w-full">
                        <ButtonMessage
                          type="green"
                          product={product}
                          showIcon={true}
                        />
                      </div>
                    </>
                  )}

                  {product?.messages_calls === "1" && (
                    <div className="h-10 w-full">
                      <ButtonCall
                        type="white"
                        showIcon={true}
                        phone={getProductPhone(product)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* START PROPS */}
            <PostProperties product={product} />
            {/* END PROPS */}

            {/* START DESCRIPTION */}
            <PostDescription description={product.product_description} />
            {/* END DESCRIPTION */}

            {/* START JK INFORMATION */}

            {slug && slug === "flats" &&
            product?.rc_link ? (
              <PostJkInfo rc_link={product?.rc_link} />
            ) : (
              <>
                {slug && slug === "flats" &&
                  product?.building_link && (
                    <PostJkInfo building_link={product?.building_link} />
                  )}
              </>
            )}

            {/* END JK INFORMATION */}

            {/* START YANDEX MAP */}
            <PostYandexMap
              containerClassName={"mb-2 mb:mb-5"}
              zoom={15}
              address={product.properties && product.properties.product_address}
              map={product.map_coordinates}
            />
            {/* END YANDEX MAP */}

            {/* START FOOTER */}
            <PostFooter product={product} />
            {/* END FOOTER */}
          </div>

          {DESKTOP && <PostSidebar product={product} />}

          <div className="flex md:hidden justify-between items-center mb-5">
            <div className="text-sm">{getProductDate(product)}</div>
            <div className="text-sm">№ {product.id}</div>
            <PostViewed product={product} />
          </div>

          <div className="flex md:hidden flex-col gap-2.5 mb-5 md:mb-10">
            <span className="text-grey text-sm">Контактное лицо</span>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10">
                <UserAvatar
                  userOwner={product.user_id}
                  userName={product.user_id && product.user_id.user_name}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-grey">
                  <UserName
                    name={product.user_id && product.user_id.user_name}
                  />
                </span>

                {userProductsCount.isLoading ? (
                  <div className="w-full h-[20px]">
                    <Preloader />
                  </div>
                ) : (
                  <Link
                    href={`/users/${
                      product.user_id.sef_code || product.user_id.id
                    }`}
                  >
                    <a
                      // target={!MOBILE && "_blank"}
                      className="text-sm hover:underline cursor-pointer"
                    >
                      {userProductsCount.products.count &&
                        `${userProductsCount.products.count} ${declension(
                          userProductsCount.products.count,
                          ["объявление", "объявления", "объявлений"]
                        )}`}
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>

        {!DESKTOP && (
          <div className="bg-greylight py-4 px-2 rounded overflow-hidden">
            <Container>
              <PostRelated
                buildingLink={product.building_link}
                rcLink={product.rc_link}
                product_id={product.id}
                price={product.product_price}
                area={product.area_link}
              />
            </Container>
          </div>
        )}
      </MotionContainer>
      {/* END POST */}
    </>
  );
}
