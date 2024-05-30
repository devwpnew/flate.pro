import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import thumb from "public/post-image.jpg";
import moreIcon from "public/icons/more-icon.svg";

import Button from "@modules/common/components/button/button";
import ButtonFavorite from "@modules/common/components/button/buttonFavorite";
import ButtonCall from "@modules/common/components/button/buttonCall";

import getProductDate from "helpers/formatters/product/getProductDate";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductAddress from "helpers/formatters/product/getProductAddress";
import getProductPhone from "helpers/formatters/product/getProductPhone";
import ButtonMessage from "@modules/common/components/button/buttonMessage";
import getLayout from "helpers/getLayout";

export default function ProductItemFavorite({ user, product }) {
    const isCanView = product.published !== 2 && !product.date_banned;
    const { MOBILE } = getLayout();

    return (
        <>
            <div
                className={`${
                    product.premium === 3 ? "bg-premium" : "bg-greylight"
                } shadow-md mb-2 group hover:shadow-lg`}
            >
                <div className="p-2">
                    <span
                        className={`rounded relative flex flex-col justify-center gap-1 md:gap-2.5 md:flex-row md:items-start lg:justify-start`}
                    >
                        {!isCanView && (
                            <div className="w-full md:absolute md:top-0 md:left-0 z-10">
                                <div className="py-1 max-w-[120px] font-bold text-exs md:text-xs text-primary w-full h-full rounded md:text-black bg-primary bg-opacity-20 text-center">
                                    Снято с продажи
                                </div>
                            </div>
                        )}

                        <div className="absolute top-1 right-1 md:top-2.5 md:right-2.5 lg:top-[18px] lg:right-[18px] z-10 md:hidden lg:flex lg:right-0 lg:flex-row lg:gap-2.5 lg:items-start">
                            {user && product.id && (
                                <ButtonFavorite
                                    user={user}
                                    productId={product.id}
                                    className={"top-0 right-0"}
                                />
                            )}

                            <div className="hidden lg:flex flex-col gap-2.5">
                                {isCanView &&
                                    product?.properties?.product_phone && (
                                        <ButtonCall
                                            className="px-5 py-2"
                                            type="white"
                                            phone={getProductPhone(product)}
                                        >
                                            Показать телефон
                                        </ButtonCall>
                                    )}

                                {isCanView && (
                                    <ButtonMessage
                                        className="px-5 py-2"
                                        type="green"
                                        product={product}
                                    >
                                        Написать в WA
                                    </ButtonMessage>
                                    // <Link href={"/user/profile/messages/" + product.user_id}>
                                    //   <a className="hidden lg:flex lg:flex-col lg:w-[165px]">
                                    //     <div className="h-9 mb-1.5">
                                    //       <Button type={"white"} className={"px-2.5"}>
                                    //         Написать
                                    //       </Button>
                                    //     </div>
                                    //   </a>
                                    // </Link>
                                )}
                            </div>
                        </div>

                        <Link href={isCanView ? getProductUrl(product) : "#"}>
                            <a
                                className={`flex flex-col md:items-between w-full md:flex-row gap-5 cursor-pointer ${
                                    product.date_banned && "opacity-50"
                                }`}
                                target={isCanView && MOBILE ? "_blank" : ""}
                            >
                                <div className="md:w-[410px] md:min-w-[220px] md:max-w-[220px]">
                                    <Image
                                        className="object-cover object-center"
                                        src={getProductImageSrc(product)}
                                        width={thumb.width}
                                        height={thumb.height}
                                    />
                                </div>

                                <div className="cursor-pointer relative max-w-[360px] mb-1">
                                    <span className="text-blue text-sm font-bold md:w-full block group-hover:text-bluedeep underline-offset-2 mb-1">
                                        {product.name}
                                    </span>
                                    <span className="text-primary text-base font-bold block mb-1">
                                        {getProductPrice(product)} руб.
                                    </span>
                                    <span className="text-grey text-xs md:w-full block mb-1">
                                        {getProductAddress(product)}
                                    </span>
                                    <span className="text-grey text-xs md:items-center md:justify-end block">
                                        {getProductDate(product)}
                                    </span>
                                    <div className="absolute bottom-1/2 right-0 md:top-1 md:bottom-auto lg:hidden">
                                        <Image
                                            src={moreIcon.src}
                                            width={moreIcon.width}
                                            height={moreIcon.height}
                                        />
                                    </div>
                                </div>
                            </a>
                        </Link>
                    </span>
                </div>
            </div>
        </>
    );
}
