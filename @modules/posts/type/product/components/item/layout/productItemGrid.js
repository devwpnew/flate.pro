import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

import ButtonFavorite from "@modules/common/components/button/buttonFavorite";
import AdminToolsButton from "../part/admitToolsButton";

import getProductDate from "helpers/formatters/product/getProductDate";
import getProductPriceSquares from "helpers/formatters/product/getProductPriceSquares";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import getProductAddress from "helpers/formatters/product/getProductAddress";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductSquare from "helpers/formatters/product/getProductSquare";
import getProductStatus from "helpers/formatters/product/getProductStatus";
import getProductFloor from "helpers/formatters/product/getProductFloor";
import usePremiumViews from "hooks/products/usePremiumViews";

import getLayout from "helpers/getLayout";

export default function ProductItemGrid({ user, product }) {
    // useEffect(() => {
    //   const fetchStatus = async () => {
    //     const statusResult = await getProductStatus(product);
    //     console.log(statusResult)
    //     status = statusResult;
    //   };

    //   fetchStatus();
    // }, [product]);

    const { MOBILE } = getLayout();
    const usePremiumViewsResponse = usePremiumViews(product);

    const slug = product?.section_relation[0]?.slug;

    return (
        <>
            {product && (
                <div className="relative group" id={product.id}>
                    <div className="absolute top-1 right-1 md:top-2.5 md:right-2.5 lg:top-3 lg:right-3 z-[2]">
                        {user && product.id && (
                            <ButtonFavorite productId={product.id} />
                        )}
                    </div>

                    <Link href={getProductUrl(product)}>
                        <a
                            // target={!MOBILE && "_blank"}
                            target={"_blank"}
                            className={`rounded-xl flex flex-col cursor-pointer group h-full transition-all`}
                        >
                            <div className="block">
                                {/* <div className="rounded-[10px] rounded-bl-[0px] overflow-hidden w-full">
                  <Image
                    className="object-cover object-center h-full w-full"
                    src={getProductImageSrc(product)}
                    width={220}
                    height={160}
                    layout="responsive"
                    quality={50}
                    onError={(e) => console.error(e.target.id)}
                  />
                </div> */}

                                <div
                                    className="rounded-[10px] rounded-bl-[0px] overflow-hidden w-full h-[160px]"
                                    style={{
                                        backgroundImage: `url(${getProductImageSrc(
                                            product
                                        )})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    onError={(e) => console.error(e.target.id)}
                                ></div>

                                <div className="text-primary text-[18px] tracking-tight font-bold block mt-[5px] md:mt-[10px]">
                                    {getProductPrice(product)} ₽
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:flex-wrap cursor-pointer gap-0.5">
                                {/* <span
                  className="block text-xs text-grey ellipsis ellipsis-clamp-2"
                  style={{
                    minHeight: "34px",
                    maxHeight: "34px",
                    height: "34px",
                  }}
                >
                  {getProductAddress(product)}
                </span> */}

                                <span className="text-grey w-full">
                                    <div className="text-[12px] font-bold grid grid-cols-2 gap-1">
                                        {/* {getProductPriceSquares(product)} руб. за{" "}
                    {slug && slug === "land" ? "сотку" : "м2"} */}

                                        {/* <p>{JSON.stringify(product)}</p> */}

                                        {product.statusValue && (
                                            <div className="flex gap-[4px]">
                                                <p className="text-backdrop/40">
                                                    Вид
                                                </p>
                                                <p className="truncate">
                                                    {product.statusValue}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-[4px]">
                                            <p className="text-backdrop/40">
                                                Этаж
                                            </p>
                                            <p>{getProductFloor(product)}</p>
                                        </div>

                                        {/* {getProductPriceSquares(product)} руб. за{" "}
                    {slug && slug === "land" ? "сотку" : "м2"} */}

                                        <div className="flex gap-[4px]">
                                            <p className="text-backdrop/40">
                                                S=
                                            </p>
                                            <p>
                                                {getProductSquare(product)} м²
                                            </p>
                                        </div>

                                        <div className="flex gap-[4px]">
                                            <p className="text-backdrop/40 whitespace-nowrap">
                                                ₽/м²
                                            </p>
                                            <p className="truncate">
                                                {getProductPriceSquares(
                                                    product
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* <span className="block text-[0.70rem] sm:text-xs">
                    {getProductDate(product)}
                  </span> */}
                                </span>

                                <div className="truncate block text-[12px] font-medium md:w-full md:leading-[18px] group-hover:text-bluelight">
                                    {product.name}
                                </div>
                            </div>
                        </a>
                    </Link>

                    <AdminToolsButton
                        user={user}
                        product={product}
                        className="absolute top-[15px] left-[15px] cursor-pointer z-1"
                    />
                </div>
            )}
        </>
    );
}
