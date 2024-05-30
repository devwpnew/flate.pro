import API from "pages/api/service/api";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";

import H2 from "@modules/common/components/heading/h2";
import Button from "@modules/common/components/button/button";

import ProductItem from "../item/productItem";
import ProductPreloader from "@modules/common/components/preloader/productPreloader";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import ProductsSortSelect from "./part/productsSortSelect";

import Preloader from "@modules/common/components/preloader/preloader";
import ProductsShowOnMap from "./part/ProductsShowOnMap";

export default function ProductContainerWithFetch({
    isTitleLoading = false,
    title,
    products,
    productsCount,
    hotDeals,
    isLoading = false,
    isLoadingCallback,
    startFrom,
    limit,
    callback,
    fallbackComponent,
    className = "",
    bgClassName = "",
    isShowMap = false,
    isHideSort = false,
    isHideTitle = false,
    sortCallback,
    sectionId,
}) {
    const activeCity = useSelector((state) => state.userCity.value);

    const anchorEnd = useRef(null);

    const [preloaderAmountTmp, setPreloaderAmountTmp] = useState(limit);
    const [hasMore, setHasMore] = useState(true);

    const getMorePage = useRef(startFrom);
    const getMorePost = async () => {
        getMorePage.current = getMorePage.current + 1;
        setPreloaderAmountTmp((val) => val + limit);

        isLoadingCallback(true);

        const filter = {
            window_host: window.location.origin,
            filter: {
                published: 1,
            },
            limit: limit,
            sort: {
                date_sort: "DESC",
            },
        };

        if (activeCity) {
            filter["filter"]["city_link"] = activeCity.id;
        }

        if (sectionId) {
            filter["filter"]["section_relation"] = sectionId;
        }

        if (hotDeals) {
            if (products) {
                filter["filter"]["id"] = {
                    exclude: products.map((el) => el.id),
                };
            }
            filter["filter"]["premium"] = "!false";
            filter["sort"] = { stat_views_preview: "ASC" };
        } else {
            if (getMorePage) {
                filter["page"] = getMorePage.current;
            }
        }

        // console.log("filter", filter);

        const newProducts = await API.get.product.list(filter);

        if (
            newProducts &&
            Array.isArray(newProducts) &&
            newProducts.length !== 0
        ) {
            callback([...products, ...newProducts]);

            if (newProducts.length < limit) {
                setHasMore(false);
            }

            isLoadingCallback(false);
            scrollToEnd();

            return;
        }

        setHasMore(false);

        isLoadingCallback(false);
        scrollToEnd();
    };

    const scrollToEnd = () => {
        anchorEnd.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    };

    return (
        <div className={`${className} ${products && ""}`}>
            {!products && !isLoading ? <>{fallbackComponent}</> : <></>}

            <div className={`${bgClassName} flex flex-col items-start gap-2.5`}>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row justify-between gap-2.5">
                        {!isHideTitle && (
                            <div>
                                {!isTitleLoading && !isLoading ? (
                                    <H2
                                        customClassName={
                                            "text-primary text-xl md:text-[28px] font-bold lg:pb-[10px]"
                                        }
                                    >
                                        {title && title}
                                        <span className="text-backdrop/40 ml-2">
                                            {productsCount}
                                        </span>
                                    </H2>
                                ) : (
                                    <div className="w-1/2 h-11 pb-[4px]">
                                        <Preloader />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="hidden md:flex items-center lg:flex-nowrap gap-[5px] md:gap-[14px]">
                            {isShowMap && (
                                <div>
                                    {!isLoading ? (
                                        <ProductsShowOnMap
                                            type="white"
                                            products={products}
                                        />
                                    ) : (
                                        <div className="w-[116px] h-[30px]">
                                            <Preloader />
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isHideSort && (
                                <ProductsSortSelect callback={sortCallback} />
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[10px] gap-y-[14px] lg:gap-[20px] w-full`}
                >
                    {!isLoading &&
                        products?.length &&
                        products.map((product) => (
                            <ProductItem
                                key={title + product?.id}
                                product={product}
                                hotDeal={hotDeals}
                            />
                        ))}

                    {isLoading && (
                        <ProductPreloader amount={preloaderAmountTmp} />
                    )}

                    <div ref={anchorEnd}></div>
                </div>

                {!isLoading ? (
                    products?.length >= limit &&
                    productsCount > 4 &&
                    hasMore && (
                        <div
                            className={"h-12 w-full mt-[15px]"}
                            onClick={getMorePost}
                        >
                            <Button
                                className={
                                    "bg-greyextralight group border border-x-bluefocus h-10"
                                }
                            >
                                <span className="text-blue group-hover:text-white">
                                    Показать еще
                                </span>
                            </Button>
                        </div>
                    )
                ) : (
                    <div
                        className={
                            "flex justify-center items-center h-12 w-full mt-[15px]"
                        }
                    >
                        <PreloaderSpinner />
                    </div>
                )}
            </div>
        </div>
    );
}
