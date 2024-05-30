import { useState } from "react";
import { useSelector } from "react-redux";

import { Tab } from "@headlessui/react";
import { Fragment } from "react";

import getLayout from "helpers/getLayout";

import ProductContainer from "@modules/posts/type/product/components/template/productsContainer";
import ProductsEmpty from "@modules/posts/type/product/components/part/productsEmpty";
import ButtonShare from "@modules/common/components/button/buttonShare";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import MotionContainer from "@modules/common/components/container/motionContainer";

export default function itemsContent({
    products,
    productsModerated,
    productsArchive,
    isLoading,
    setIsLoading,
    setProducts,
    setProductsArchive,
    setProductsModerated,
    setSort,
}) {
    const user = useSelector((state) => state.userLogin.value);

    const { MOBILE } = getLayout();
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <MotionContainer>
            {MOBILE && (
                <MobilePageHeader
                    href={"/user/profile"}
                    title="Мои объявления"
                />
            )}

            <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <div className="px-[10px] lg:px-0 text-[.8rem] md:text-[14px]">
                    <div className="relative mb-2.5 flex flex-col gap-2 md:flex-row justify-between items-center pb-[2px]">
                        <Tab.List>
                            <div className="w-full flex flex-row flex-wrap justify-between gap-[10px] md:justify-between lg:justify-start">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={
                                                selected
                                                    ? "bg-primary text-white px-[15px] py-[10px] whitespace-nowrap rounded-[10px] border border-primary"
                                                    : "text-primary border border-primary/10 whitespace-nowrap rounded-[10px] px-[15px] py-[10px]"
                                            }
                                        >
                                            Все объявления{" "}
                                            <span className="text-primary/60 pl-1">
                                                {products && products.length}
                                            </span>
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={
                                                selected
                                                    ? "bg-primary text-white px-[15px] py-[10px] whitespace-nowrap rounded-[10px] border border-primary"
                                                    : "text-primary border border-primary/10 whitespace-nowrap rounded-[10px] px-[15px] py-[10px]"
                                            }
                                        >
                                            Ждут действий{" "}
                                            <span className="text-backdrop/60 pl-1">
                                                {productsModerated &&
                                                    productsModerated.length}
                                            </span>
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={
                                                selected
                                                    ? "bg-primary text-white px-[15px] py-[10px] whitespace-nowrap rounded-[10px] border border-primary"
                                                    : "text-primary border border-primary/10 whitespace-nowrap rounded-[10px] px-[15px] py-[10px] active:border-primary/10"
                                            }
                                        >
                                            Архив{" "}
                                            <span className="pl-1 opacity-60">
                                                {productsArchive &&
                                                    productsArchive.length}
                                            </span>
                                        </button>
                                    )}
                                </Tab>
                            </div>
                        </Tab.List>

                        <ButtonShare
                            type={"secondary-10"}
                            shareButtonLink={`https://flate.pro/users/${
                                (user && user.sef_code) || user.id
                            }`}
                        >
                            Поделиться профилем
                        </ButtonShare>
                    </div>
                </div>
                {/* flex flex-col items-start w-full gap-2.5 */}
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
                            <ProductContainer
                                containerClassName="flex flex-col gap-1 w-full"
                                products={products}
                                hotDeals={false}
                                isLoading={isLoading}
                                isLoadingCallback={setIsLoading}
                                preloaderAmount={4}
                                callback={setProducts}
                                sortCallback={setSort}
                                layout="settings"
                                hideUserInfo={true}
                                fallbackComponent={<ProductsEmpty />}
                                isShareButton={false}
                                shareButtonLink={`https://flate.pro/users/${
                                    (user && user.sef_code) || user.id
                                }`}
                                shareButtonText={"Поделиться профилем"}
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
                            <ProductContainer
                                containerClassName="flex flex-col gap-1 w-full"
                                products={productsModerated}
                                hotDeals={false}
                                isLoading={isLoading}
                                isLoadingCallback={setIsLoading}
                                preloaderAmount={10}
                                callback={setProductsModerated}
                                sortCallback={setSort}
                                layout="settings"
                                isModeration={true}
                                hideUserInfo={true}
                                fallbackComponent={
                                    <ProductsEmpty title="У вас нет объявлений на модерации" />
                                }
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
                            <ProductContainer
                                containerClassName="grid md:grid-cols-3 gap-[20px] w-full"
                                products={productsArchive}
                                hotDeals={false}
                                isLoading={isLoading}
                                isLoadingCallback={setIsLoading}
                                preloaderAmount={10}
                                callback={setProductsArchive}
                                sortCallback={setSort}
                                layout="settings"
                                hideUserInfo={true}
                                fallbackComponent={
                                    <ProductsEmpty title="У вас нет объявлений в архиве" />
                                }
                            />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </MotionContainer>
    );
}
