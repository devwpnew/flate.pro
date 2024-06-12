import API from "pages/api/service/api";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import AdminTools from "../part/adminTools";
import Button from "@modules/common/components/button/button";

import thumb from "public/post-image.jpg";
import heartIconRed from "public/icons/heart-red.svg";
import viewedIcon from "public/icons/viewed-icon.svg";
import moreIcon from "public/icons/more-icon.svg";

import { BsThreeDots } from "react-icons/bs";

import OutsideAlerter from "hooks/useOutsideAlerter";
import Preloader from "@modules/common/components/preloader/preloader";

import getProductDate from "helpers/formatters/product/getProductDate";
import getProductAddress from "helpers/formatters/product/getProductAddress";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import LineStatusBar from "@modules/common/components/statusbar/lineStatusBar";

export default function ProductItemSettings({ product, isModeration }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showAdminTools, setShowAdminTools] = useState(false);
    const [favoriteStat, setFavoriteStat] = useState(0);
    const [productExpiry, setProductExpiry] = useState(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if (product && product.published !== 2) {
                const favCount = await API.get.product.favoritesCount(
                    product.id
                );
                const expiry = await API.get.product.expiry(product);

                if (favCount) {
                    setFavoriteStat(favCount);
                }

                if (expiry) {
                    setProductExpiry(expiry);
                }
            }
            setIsLoading(false);
        })();
    }, []);
    const productUrl =
        isModeration || product.published === 2
            ? `/user/profile/items/${product.id}`
            : getProductUrl(product);
    return (
        <>
            <div className="grid gap-3">
                <>
                    <Link href={productUrl} key={product.id}>
                        <a className="cursor-pointer">
                            <div className="rounded-[10px] overflow-hidden h-[200px] relative">
                                <Image
                                    className="object-cover object-center h-full w-full"
                                    src={getProductImageSrc(product)}
                                    width={thumb.width}
                                    height={thumb.height}
                                    layout="fill"
                                />
                            </div>
                        </a>
                    </Link>

                    <div className="block">
                        <div className="flex flex-col md:flex-row md:flex-wrap min-w-[160px]">
                            <div className="block">
                                <span className="text-primary text-base font-bold block">
                                    {getProductPrice(product)} руб.
                                </span>

                                <Link href={productUrl} key={product.id}>
                                    <a className="text-blue text-xs md:text-sm font-bold md:w-full block product-hover:underline underline-offset-2 cursor-pointer">
                                        {product.name}
                                    </a>
                                </Link>

                                <span className="text-grey text-exs md:text-xs hidden md:block w-full">
                                    {getProductAddress(product)}
                                </span>

                                {/* BUTTONS */}

                                {/* <div className="mt-2 flex gap-5">
                                    <div className="flex items-center gap-[6px]">
                                        <Image
                                            src={viewedIcon.src}
                                            width={viewedIcon.width}
                                            height={viewedIcon.height}
                                        />
                                        <span className="text-exs md:text-xs">
                                            {product && product.stat_views
                                                ? product.stat_views
                                                : 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[6px]">
                                        <Image
                                            src={heartIconRed.src}
                                            width={heartIconRed.width}
                                            height={heartIconRed.height}
                                        />
                                        <span className="text-exs md:text-xs">
                                            {favoriteStat && favoriteStat.count}
                                        </span>
                                    </div>
                                </div> */}

                                <div className="mt-3 flex md:gap-2.5">
                                    <Link href={"/user/profile/subscribe"}>
                                        <div className="h-[30px] lg:h-auto min-w-[80px] lg:min-w-[160px] mr-1 p-1 lg:mr-0 lg:p-0 ">
                                            <Button className="flex justify-center items-center h-10">
                                                <span className="text-[8px] md:text-sm hidden lg:inline">
                                                    Сделать премиум
                                                </span>
                                                <span className="text-[8px] inline lg:hidden">
                                                    Премиум
                                                </span>
                                            </Button>
                                        </div>
                                    </Link>

                                    <OutsideAlerter
                                        action={() => setShowAdminTools(false)}
                                    >
                                        <div className="relative hidden lg:block">
                                            <div
                                                onClick={() =>
                                                    setShowAdminTools(
                                                        !showAdminTools
                                                    )
                                                }
                                                className="min-w-[14px] md:p-1 lg:border lg:border-backdrop/10 md:min-w-[31px] md:flex md:justify-center md:items-center md:rounded-[10px] cursor-pointer h-10 w-10"
                                            >
                                                <BsThreeDots />

                                                {/* <Image
                                        src={moreIcon.src}
                                        width={moreIcon.width}
                                        height={moreIcon.height}
                                    /> */}
                                            </div>

                                            <div
                                                className={
                                                    showAdminTools
                                                        ? "block"
                                                        : "hidden"
                                                }
                                            >
                                                <AdminTools
                                                    className={"top-[15px]"}
                                                    editLink={true}
                                                    editLinkId={product.id}
                                                    publishedStatus={
                                                        product.published
                                                    }
                                                    action={() =>
                                                        setShowAdminTools(false)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </OutsideAlerter>
                                </div>

                                {/* BUTTONS */}

                                {/* <div className="block w-full mb-1">
                    <div
                      className="ellipsis ellipsis-clamp-2"
                      style={{
                        minHeight: "36px",
                        maxHeight: "36px",
                        height: "36px",
                      }}
                    >
                      <span className="text-grey text-xs block w-full">
                        <div>{product.product_description}</div>
                      </span>
                    </div>
                  </div> */}

                                {/* <span className="text-grey text-exs md:text-xs hidden md:block w-full">
                    {getProductDate(product)}
                  </span> */}
                            </div>

                            <div className="block">
                                {isModeration ? (
                                    <div className="w-full md:absolute md:top-0 md:left-0">
                                        <div className="py-1 max-w-[120px] font-bold text-exs md:text-xs text-primary w-full h-full rounded md:text-black bg-primary bg-opacity-20 text-center">
                                            {product.published == 3
                                                ? "Отклонено"
                                                : "На модерации"}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {isLoading ? (
                                            <div className="w-full h-1/2">
                                                <Preloader />
                                            </div>
                                        ) : (
                                            <>
                                                {product.published !== 2 && (
                                                    <LineStatusBar
                                                        num={productExpiry}
                                                        max={10}
                                                        md={10}
                                                        min={3}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    );
}
