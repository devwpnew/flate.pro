import API from "pages/api/service/api";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import InfiniteScroll from "react-infinite-scroll-component";

import H2 from "@modules/common/components/heading/h2";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import ProductPreloader from "@modules/common/components/preloader/productPreloader";
import ProductItem from "../item/productItem";
import ProductsEmpty from "../part/productsEmpty";

import randomInteger from "helpers/randomInteger";
import Preloader from "@modules/common/components/preloader/preloader";
import { useRouter } from "next/router";
import ProductsSortSelect from "./part/productsSortSelect";

import ProductsShowOnMap from "./part/ProductsShowOnMap";

export default function ProductContainerInfinite({
    title,
    isTitleLoading,
    products,
    productsCount,
    limit,
    hotDeals,
    isLoading,
    isLoadingCallback,
    preloaderAmount,
    callback,
    startFrom,
    sectionId,
    isShowMap,
    containerClassName,
    layout,
    isHideSort,
    sortCallback,
}) {
    const router = useRouter();

    const queryId = router.query?.id;

    const filterGlobalFields = useSelector(
        (state) => state.filterGlobalFields.value
    );
    const activeCity = useSelector((state) => state.userCity.value);

    const [hasMore, setHasMore] = useState(true);
    // const [getMorePage, setGetMorePage] = useState(2);

    const getMorePage = useRef(startFrom);
    const getMorePost = async () => {
        // console.log("============ getMorePost =============");
        getMorePage.current = getMorePage.current + 1;
        // setGetMorePage(getMorePage + 1);
        // setPreloaderAmountTmp((val) => val + limit);

        // isLoadingCallback(true);

        const filter = {
            window_host: window.location.origin,
            sort: {
                date_sort: "DESC",
            },
            filter: {
                published: 1,
                ...filterGlobalFields,
            },
            limit: limit,
        };

        if (queryId && router.asPath.includes("/users/")) {
            filter["filter"]["user_id"] = queryId;
        }

        if (queryId && router.asPath.includes("/rcs/")) {
            filter["filter"]["rc_link"] = queryId;
        }

        if (queryId && router.asPath.includes("/building/")) {
            filter["filter"]["building_link"] = queryId;
        }

        if (getMorePage) {
            filter["page"] = getMorePage.current;
        }

        if (activeCity) {
            filter["filter"]["city_link"] = activeCity.id;
        }

        if (sectionId) {
            filter["filter"]["section_relation"] = sectionId;
        }

        if (hotDeals) {
            filter["filter"]["premium"] = "!false";
            filter["sort"] = { stat_views: "ASC" };
        }

        const newProducts = await API.get.product.list(filter);

        // console.log(filter, "filter infinite");

        if (
            newProducts &&
            Array.isArray(newProducts) &&
            newProducts.length !== 0
        ) {
            callback([...products, ...newProducts]);

            if (newProducts.length < limit) {
                setHasMore(false);
            }

            // isLoadingCallback(false);
            // scrollToEnd();

            return;
        }

        setHasMore(false);

        // isLoadingCallback(false);
        // scrollToEnd();
    };

    const isInfiniteScroll = products?.length && limit > products.length;

    function renderTitle() {
        if (isTitleLoading && isLoading) {
            return (
                <div className="w-full h-11">
                    <Preloader />
                </div>
            );
        }

        if (products?.length > 0) {
            return (
                <>
                    <div className="flex flex-wrap justify-between items-center mb-[10px]">
                        <H2
                            customClassName={
                                `
                                    text-primary text-xl md:text-[28px] font-bold
                                    mb-1.5 md:mb-0
                                `
                            }
                        >
                            {title && title}
                            <span className="text-backdrop/40 ml-2">
                                {productsCount}
                            </span>
                        </H2>

                        <div className="w-full md:w-auto grid grid-cols-2 md:flex gap-[10px] items-center">
                            
                            <div className="mb-3 md:mb-0 md:flex items-center lg:flex-nowrap gap-[5px] md:gap-[14px] h-[30px]">
                                {!isHideSort && (
                                    <ProductsSortSelect
                                        callback={sortCallback}
                                    />
                                )}
                            </div>

                            {isShowMap && (
                                <div>
                                    {!isLoading ? (
                                        <ProductsShowOnMap
                                            className={'w-full px-[20px] py-[10px] whitespace-nowrap'}
                                            type="white"
                                            products={products}
                                        />
                                    ) : (
                                        <div className="w-[116px] h-[25px]">
                                            <Preloader />
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </>
            );
        }
    }

    return (
        <div className="flex flex-col items-start gap-1 w-full">
            {title && <div className="w-full">{renderTitle()}</div>}

            {!isInfiniteScroll ? (
                <>
                    {!isLoading && products && products.length !== 0 && (
                        <div className="w-full">
                            <InfiniteScroll
                                style={{
                                    width: "100%",
                                    position: "relative",
                                    overflow: "visible",
                                }}
                                dataLength={products.length}
                                next={getMorePost}
                                hasMore={hasMore}
                                loader={
                                    <div className="flex flex-col items-center w-full absolute bottom-0 left-0">
                                        <PreloaderSpinner />
                                    </div>
                                }
                                // endMessage={"Товары отсутствуют."}
                            >
                                <div
                                    className={
                                        containerClassName
                                            ? containerClassName
                                            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[10px] gap-y-[14px] lg:gap-[20px] w-full pb-[100px]"
                                    }
                                >
                                    {products &&
                                        products.map((data, index) => (
                                            <ProductItem
                                                layout={layout}
                                                product={data}
                                                hotDeals={hotDeals && hotDeals}
                                                key={`${data.id}${index}`}
                                            />
                                        ))}
                                </div>
                            </InfiniteScroll>
                        </div>
                    )}

                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-1 w-full">
                            <ProductPreloader amount={preloaderAmount} />
                        </div>
                    )}
                </>
            ) : (
                <>
                    {!isLoading && products && products.length !== 0 && (
                        <div className="w-full">
                            <div
                                className={
                                    containerClassName
                                        ? containerClassName
                                        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-1 w-full p-[3px] pb-[100px]"
                                }
                            >
                                {products &&
                                    products.map((data) => (
                                        <ProductItem
                                            layout={layout}
                                            product={data}
                                            hotDeals={hotDeals && hotDeals}
                                            key={`${data.id}${randomInteger()}`}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
