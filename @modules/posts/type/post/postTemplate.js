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
import PostUserInfo from "./parts/postUserInfo";

import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductPriceSquares from "helpers/formatters/product/getProductPriceSquares";
import getProductDate from "helpers/formatters/product/getProductDate";
import getProductPhone from "helpers/formatters/product/getProductPhone";
import getProductAddress from "helpers/formatters/product/getProductAddress";
import declension from "helpers/formatters/declension";
import ButtonFavorite from "@modules/common/components/button/buttonFavorite";

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

                

                
                {/* <div className="bg-greylight py-4 border-b-[1px] border-greyborder">
                    <div className="mx-auto container px-[15px] ">
                        <div className="flex items-center justify-between">
                            {!DESKTOP && (
                                <BackButton
                                    onClick={backButtonHandler}
                                    className="pr-4"
                                />
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
                </div> */}

                <Container className="mt-5 mb-5 md:mb-10 lg:container lg:mx-auto lg:gap-5 items-start relative">



                    {/* START GALLERY MOBILE */}
                    {MOBILE && gal && (
                        <PostGallery
                            previewImage={gal[0]}
                            galleryImages={gal}
                        />
                    )}
                    {/* END GALLERY MOBILE */}


                    
                    {/* Grid */}
                    <div className="mb-[20px] md:mb-10 w-full flex gap-16">
                        {/* Col 1 */}
                        <div className="hidden md:block md:w-[60%]">
                            
                            
                            
                            


                            

                            {/* <div className="hidden md:flex items-center gap-2 text-sm py-5">
                  <Image src={mapIcon.src} width={12} height={15} />
                  {getProductAddress(product)}
                </div> */}

                            {/* START HEADER */}
                            {/* <PostHeader product={product} /> */}
                            {/* END HEADER */}

                            {/* START GALLERY DESKTOP */}
                            {!MOBILE && gal && (
                                <PostGallery
                                    previewImage={gal[0]}
                                    galleryImages={gal}
                                />
                            )}
                            {/* END GALLERY DESKTOP */}

                            {!DESKTOP && (
                                <>
                                    <div className="hidden">
                                        <div className="flex flex-col gap-1 mb-2 md:mb-5">
                                            <span className="text-primary text-2xl font-bold">
                                                {getProductPrice(product)} ₽
                                            </span>
                                            <span>
                                                {getProductPriceSquares(
                                                    product
                                                )}{" "}
                                                ₽/{" "}
                                                {slug && slug === "land"
                                                    ? "сотку"
                                                    : "м²"}
                                            </span>
                                        </div>

                                        <div className="hidden items-center justify-between gap-2.5 mb-2 md:mb-5">
                                            {product?.messages_calls ===
                                                "0" && (
                                                <>
                                                    <div className="h-10 w-full">
                                                        <ButtonCall
                                                            type="white"
                                                            showIcon={true}
                                                            phone={getProductPhone(
                                                                product
                                                            )}
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

                                            {product?.messages_calls ===
                                                "1" && (
                                                <div className="h-10 w-full">
                                                    <ButtonCall
                                                        type="white"
                                                        showIcon={true}
                                                        phone={getProductPhone(
                                                            product
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* START PROPS */}
                            {/* <PostProperties product={product} /> */}
                            {/* END PROPS */}

                            {/* START DESCRIPTION */}
                            {/* <PostDescription
                                description={product.product_description}
                            /> */}
                            {/* END DESCRIPTION */}

                            {/* START JK INFORMATION */}

                            {/* {slug && slug === "flats" && product?.rc_link ? (
                                <PostJkInfo rc_link={product?.rc_link} />
                            ) : (
                                <>
                                    {slug &&
                                        slug === "flats" &&
                                        product?.building_link && (
                                            <PostJkInfo
                                                building_link={
                                                    product?.building_link
                                                }
                                            />
                                        )}
                                </>
                            )} */}

                            {/* END JK INFORMATION */}

                            {/* START YANDEX MAP */}
                            {/* <PostYandexMap
                                containerClassName={"mb-2 mb:mb-5"}
                                zoom={15}
                                address={
                                    product.properties &&
                                    product.properties.product_address
                                }
                                map={product.map_coordinates}
                            /> */}
                            {/* END YANDEX MAP */}

                            {/* START FOOTER */}
                            {/* <PostFooter product={product} /> */}
                            {/* END FOOTER */}





                            <div className="mt-10">
                                <PostDescription
                                    description={product.product_description}
                                />
    
                                <PostYandexMap
                                    containerClassName={
                                        "w-full rounded-[10px] overflow-hidden mb-[20px]"
                                    }
                                    zoom={15}
                                    address={
                                        product.properties &&
                                        product.properties.product_address
                                    }
                                    map={product.map_coordinates}
                                />
                            </div>




                            
                        </div>
                        {/* Col 1 */}

                        {/* Col 2 */}
                        <div>
                        <div className="sticky top-[80px]">







                            {DESKTOP &&
                            slug &&
                            slug === "flats" &&
                            product?.rc_link ? (
                                <PostJkInfo rc_link={product?.rc_link} />
                            ) : (
                                <>
                                    {DESKTOP &&
                                        slug &&
                                        slug === "flats" &&
                                        product?.building_link && (
                                            <PostJkInfo
                                                building_link={
                                                    product?.building_link
                                                }
                                            />
                                        )}
                                </>
                            )}

                            <PostHeader product={product} />

                            <hr className="border-[#E5E5E5] mt-4 mb-1 hidden md:block" />

                            <div className="flex gap-5 items-center justify-between">
                                <span className="text-primary text-[30px] tracking-tighter font-bold">
                                    {getProductPrice(product)} ₽
                                </span>
                                <span className="text-[20px] tracking-tight text-[#000]/50">
                                    {getProductPriceSquares(product)} ₽/{" "}
                                    {slug && slug === "land" ? "сотку" : "м²"}
                                </span>
                            </div>

                            <div className="text-sm flex gap-3 text-backdrop/60">
                                <div>{getProductAddress(product)}</div>
                            </div>

                            <PostProperties product={product} />

                            <hr className="border-[#E5E5E5] mt-3" />

                            <div className="grid md:flex gap-5 items-center md:justify-between">
                                <PostUserInfo product={product} />
                            </div>

                            <div class="mb-5">
                                <div className="flex items-center justify-between gap-3 mb-[20px] md:mb-0">
                                    {product?.messages_calls === "0" && (
                                        <>
                                            <ButtonCall
                                                type="white"
                                                className="flex justify-center items-center py-3 px-6"
                                                phone={getProductPhone(product)}
                                                showIcon={false}
                                                iconW="20"
                                                iconH="20"
                                            >
                                                Телефон
                                            </ButtonCall>

                                            <ButtonMessage
                                                type="green"
                                                className="flex justify-center items-center py-3 px-6"
                                                showIcon={false}
                                                product={product}
                                            >
                                                WhatsApp
                                            </ButtonMessage>
                                        </>
                                    )}

                                    {product?.messages_calls === "1" && (
                                        <>
                                            <ButtonCall
                                                type="white"
                                                className="py-3 px-5 my-auto rounded-[10px]"
                                                phone={getProductPhone(product)}
                                                showIcon={false}
                                                iconW="20"
                                                iconH="20"
                                            >
                                                <span className="font-bold">
                                                    Показать телефон
                                                </span>
                                            </ButtonCall>
                                        </>
                                    )}
                                </div>
                            </div>
                            <hr className="border-[#E5E5E5] md:mb-3" />

                            <div className="hidden md:block">
                                <PostFooter product={product} />
                            </div>





                            <div className="md:hidden mt-5">
                                <PostDescription
                                    description={product.product_description}
                                />
    
                                <PostYandexMap
                                    containerClassName={
                                        "w-full rounded-[10px] overflow-hidden mb-[20px]"
                                    }
                                    zoom={15}
                                    address={
                                        product.properties &&
                                        product.properties.product_address
                                    }
                                    map={product.map_coordinates}
                                />
                            </div>





                        </div>
                        </div>
                        {/* Col 2 */}
                    </div>
                    {/* Grid */}

                    {!DESKTOP &&
                    slug &&
                    slug === "flats" &&
                    product?.rc_link ? (
                        <PostJkInfo rc_link={product?.rc_link} />
                    ) : (
                        <>
                            {!DESKTOP &&
                                slug &&
                                slug === "flats" &&
                                product?.building_link && (
                                    <PostJkInfo
                                        building_link={product?.building_link}
                                    />
                                )}
                        </>
                    )}

                    {/* <div className="w-full flex gap-10 md:gap-10">
                        <div className="md:w-[60%]">
                            <PostDescription
                                description={product.product_description}
                            />

                            <PostYandexMap
                                containerClassName={
                                    "w-full rounded-[10px] overflow-hidden mb-[20px]"
                                }
                                zoom={15}
                                address={
                                    product.properties &&
                                    product.properties.product_address
                                }
                                map={product.map_coordinates}
                            />
                        </div>
        
                        <div>
                            <PostYandexMap
                                containerClassName={"w-full rounded-[10px] overflow-hidden mb-[20px]"}
                                zoom={15}
                                address={
                                    product.properties &&
                                    product.properties.product_address
                                }
                                map={product.map_coordinates}
                            />

                            <div className="md:hidden">
                                <PostFooter product={product} />
                            </div>
                        </div>
                    </div> */}
                  

                    {/* {DESKTOP && <PostSidebar product={product} />} */}

                    <div className="hidden justify-between items-center mb-5">
                        <div className="text-sm">{getProductDate(product)}</div>
                        <div className="text-sm">№ {product.id}</div>
                        {/* <PostViewed product={product} /> */}
                    </div>

                    <div className="hidden flex-col gap-2.5 mb-5 md:mb-10">
                        <span className="text-grey text-sm">
                            Контактное лицо
                        </span>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10">
                                <UserAvatar
                                    userOwner={product.user_id}
                                    userName={
                                        product.user_id &&
                                        product.user_id.user_name
                                    }
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-grey">
                                    <UserName
                                        name={
                                            product.user_id &&
                                            product.user_id.user_name
                                        }
                                    />
                                </span>

                                {userProductsCount.isLoading ? (
                                    <div className="w-full h-[20px]">
                                        <Preloader />
                                    </div>
                                ) : (
                                    <Link
                                        href={`/users/${
                                            product.user_id.sef_code ||
                                            product.user_id.id
                                        }`}
                                    >
                                        <a
                                            // target={!MOBILE && "_blank"}
                                            className="text-sm hover:underline cursor-pointer"
                                        >
                                            {userProductsCount.products.count &&
                                                `${
                                                    userProductsCount.products
                                                        .count
                                                } ${declension(
                                                    userProductsCount.products
                                                        .count,
                                                    [
                                                        "объявление",
                                                        "объявления",
                                                        "объявлений",
                                                    ]
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
