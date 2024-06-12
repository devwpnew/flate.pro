import Link from "next/link";
import Image from "next/image";

import { useMemo } from "react";
import { useRouter } from "next/router";

import UserAvatar from "@modules/user/components/profile/common/userAvatar";
import UserName from "@modules/user/components/profile/common/userName";
import ButtonMessage from "@modules/common/components/button/buttonMessage";
import ButtonCall from "@modules/common/components/button/buttonCall";
import ButtonFavorite from "@modules/common/components/button/buttonFavorite";
import Preloader from "@modules/common/components/preloader/preloader";
import AdminToolsButton from "../part/admitToolsButton";

import thumb from 'public/post-image.jpg';
import useProductsCount from "hooks/products/useProductsCount";

import declension from "helpers/formatters/declension";
import getProductDate from "helpers/formatters/product/getProductDate";
import getProductPriceSquares from "helpers/formatters/product/getProductPriceSquares";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductAddress from "helpers/formatters/product/getProductAddress";
import getProductPhone from "helpers/formatters/product/getProductPhone";
import usePremiumViews from "hooks/products/usePremiumViews";

import getLayout from "helpers/getLayout";

export default function ProductItemRow({ product, user, hideUserInfo }) {
  const { MOBILE } = getLayout();
  const router = useRouter();
  const useViewsResponse = usePremiumViews(product);
  const userProductsCount = useProductsCount(
    useMemo(() => {
      return {
        user_id: product.user_id.id,
        published: "1",
      };
    }, [])
  );

  const goToUserProductsPage = (ev) => {
    ev.preventDefault();
    router.push(`/users/${product.user_id.sef_code || product.user_id.id}`);
  };

  const slug = product?.section_relation[0]?.slug;

  return (
    <>
      {product && (
        <div
          id={product.id}
          className={`relative transition-all lg:p-[16px] rounded group hover:shadow-lg hover:bg-greylight p-2 group bg-greylight`}
          style={{
            background: product.premium > 0 && "rgba(175, 210, 117, 0.14)",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 4px 20px rgba(68, 68, 68, 0.08)",
            borderRadius: "4px",
          }}
        >
          <div className="flex flex-col md:flex-row md:gap-[15px] justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="block relative md:max-h-[204px] md:max-w-[220px] w-full">
                <div className="absolute top-1 right-1 md:top-2.5 md:right-2.5 lg:top-[10px] lg:right-[10px] z-10">
                  {user && product.id && (
                    <ButtonFavorite productId={product.id} />
                  )}
                </div>

                <Link href={getProductUrl(product)} key={product.id}>
                  <a
                    // target={!MOBILE && "_blank"}
                    target={"_blank"}
                    className="block min-w-[220px]"
                  >
                    <Image
                      className="object-cover object-center"
                      src={getProductImageSrc(product)}
                      width={thumb.width}
                      height={thumb.height}
                      layout="responsive"
                      quality={50}
                    />
                  </a>
                </Link>
              </div>

              <Link href={getProductUrl(product)}>
                <a
                  // target={!MOBILE && "_blank"}
                  target={"_blank"}
                  className="block md:max-w-[313px] lg:max-w-[480px]"
                >
                  <div className="flex flex-col h-full">
                    <div className="block">
                      <div
                        className="ellipsis ellipsis-clamp-2"
                        style={{
                          minHeight: "55px",
                          maxHeight: "55px",
                          height: "55px",
                        }}
                      >
                        <span className="text-primary text-sm lg:text-lg font-bold md:w-full block underline-offset-2 mb-[4px] group-hover:text-bluelight">
                          {product.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-primary text-base font-bold whitespace-nowrap">
                          {getProductPrice(product)} руб.
                        </span>
                        <span className="text-primary text-xs md:text-sm lg:text-lg whitespace-nowrap">
                          {getProductPriceSquares(product)} руб. за{" "}
                          {slug && slug === "land"
                            ? "сотку"
                            : "м2"}
                        </span>
                      </div>
                      <span className="block w-full text-primary text-xs mb-1">
                        {getProductAddress(product)}
                      </span>
                    </div>

                    {/* {product?.product_description && (
                      <div className="block w-full mb-1">
                        <div className="ellipsis">
                          <span className="text-grey text-xs block w-full">
                            <div>{parseToJsx(product.product_description)}</div>
                          </span>
                        </div>
                      </div>
                    )} */}

                    <span className="text-grey text-xs block mt-auto">
                      <div>{getProductDate(product)}</div>
                    </span>
                  </div>
                </a>
              </Link>
            </div>

            {!hideUserInfo && (
              <div className="hidden min-w-[130px] md:block">
                <div className="flex flex-col w-full">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-10 h-10">
                      <UserAvatar
                        userOwner={product.user_id}
                        onClick={goToUserProductsPage}
                      />
                    </div>

                    <div className="block flex-grow">
                      <span className="font-bold block leading-5">
                        <UserName name={product.user_id.user_name} />
                      </span>

                      {userProductsCount.isLoading && user ? (
                        <div className="w-full h-[20px]">
                          <Preloader />
                        </div>
                      ) : (
                        user && (
                          <Link
                            href={`/users/${
                              product.user_id.sef_code || product.user_id.id
                            }`}
                          >
                            <a
                              // target={!MOBILE && "_blank"}
                              target={"_blank"}
                              className="text-sm block cursor-pointer hover:text-bluelight leading-5"
                            >
                              {userProductsCount.products.count &&
                                `${
                                  userProductsCount.products.count
                                } ${declension(
                                  userProductsCount.products.count,
                                  ["объявление", "объявления", "объявлений"]
                                )}`}
                            </a>
                          </Link>
                        )
                      )}
                    </div>
                  </div>

                  {product?.messages_calls === "0" && (
                    <>
                      <div className="h-9 w-full mb-1.5">
                        <ButtonCall
                          phone={getProductPhone(product)}
                          type="white"
                          className="flex justify-center items-center px-2.5"
                        />
                      </div>

                      <div className="h-9 w-full">
                        <ButtonMessage
                          type="green"
                          className="flex justify-center items-center px-2.5"
                          product={product}
                        >
                          Написать в WhatsApp
                        </ButtonMessage>
                      </div>
                    </>
                  )}

                  {product?.messages_calls === "1" && (
                    <>
                      <div className="h-9 w-full mb-1.5">
                        <ButtonCall
                          phone={getProductPhone(product)}
                          type="white"
                          className="flex justify-center items-center px-2.5"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <AdminToolsButton
            user={user}
            product={product}
            className="absolute top-0 right-[10px] cursor-pointer z-1"
          />
        </div>
      )}
    </>
  );
}
