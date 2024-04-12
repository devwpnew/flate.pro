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
      {MOBILE && <MobilePageHeader href={"/user/profile"} title="Избранное" />}

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="px-[15px] lg:px-0">
          <div className="relative border-b-greyborder border-b mb-2.5 flex flex-col gap-2 md:flex-row justify-between items-center pb-[2px]">
            <Tab.List>
              <div className="flex flex-row flex-wrap justify-center gap-2 md:flex-row md:justify-between lg:justify-start md:gap-8">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <div
                      className={
                        selected
                          ? "border-b-blue border-b-2"
                          : "border-b-transparent border-b-2"
                      }
                    >
                      <button
                        className={
                          selected
                            ? "text-blue px-1 md:px-5 whitespace-nowrap"
                            : "text-primary px-1 md:px-5 whitespace-nowrap"
                        }
                      >
                        <span className="relative">
                          <span
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-8px",
                              fontSize: "10px",
                            }}
                          >
                            {products && products.length}
                          </span>
                          Мои объявления
                        </span>
                      </button>
                    </div>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <div
                      className={
                        selected
                          ? "border-b-blue border-b-2"
                          : "border-b-transparent border-b-2"
                      }
                    >
                      <button
                        className={
                          selected
                            ? "text-blue px-1 md:px-5 whitespace-nowrap"
                            : "text-primary px-1 md:px-5 whitespace-nowrap"
                        }
                      >
                        <span className="relative">
                          <span
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-8px",
                              fontSize: "10px",
                            }}
                          >
                            {productsModerated && productsModerated.length}
                          </span>
                          Ждут действий
                        </span>
                      </button>
                    </div>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <div
                      className={
                        selected
                          ? "border-b-blue border-b-2"
                          : "border-b-transparent border-b-2"
                      }
                    >
                      <button
                        className={
                          selected
                            ? "text-blue px-1 md:px-5 whitespace-nowrap"
                            : "text-primary px-1 md:px-5 whitespace-nowrap"
                        }
                      >
                        <span className="relative">
                          <span
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-8px",
                              fontSize: "10px",
                            }}
                          >
                            {productsArchive && productsArchive.length}
                          </span>
                          Архив
                        </span>
                      </button>
                    </div>
                  )}
                </Tab>
              </div>
            </Tab.List>

            <ButtonShare
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
                preloaderAmount={10}
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
                containerClassName="flex flex-col gap-1 w-full"
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
