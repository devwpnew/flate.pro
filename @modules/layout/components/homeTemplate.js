import API from "pages/api/service/api";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo, useLayoutEffect } from "react";

import MotionContainer from "@modules/common/components/container/motionContainer";
import Hero from "@modules/hero/components/hero";
import Sidebar from "@modules/sidebar/components/sidebar";
import ProductContainerWithFetch from "@modules/posts/type/product/components/template/productsContainerWithFetch";

import Container from "@modules/common/components/container/container";
import NewsContainer from "@modules/posts/type/news/components/template/newsContainer";
import MenuWithIcons from "@modules/menu/components/menuWithIcons";

import getLayout from "helpers/getLayout";

import ProductContainerInfinite from "@modules/posts/type/product/components/template/productContainerInfinite";
import H2 from "@modules/common/components/heading/h2";
import useProductsCount from "hooks/products/useProductsCount";

export default function HomeTemplate({
  user,
  ssrNews,
  ssrPremiumProducts,
  ssrPremiumProductsCount,
  ssrProducts,
  ssrProductsCount,
}) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();

  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const activeCity = useSelector((state) => state.userCity.value);

  const [sortObj, setSortObj] = useState({
    name: "По умолчанию",
    id: "date_published",
    sort: { date_sort: "DESC"},
  });

  const [ssrData, setSsrData] = useState({});

  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);

  const [premiumProducts, setPremiumProducts] = useState(null);
  const [products, setProducts] = useState(null);

  const startFrom = 1;
  const newPLimit = 20;
  const premPLimit = 4;

  useLayoutEffect(() => {
    if (ssrPremiumProducts) {
      setSsrData((prevState) => ({
        ...prevState,
        ssrPremiumProducts,
      }));
      setPremiumProducts(ssrPremiumProducts);
    }

    if (ssrProducts) {
      setSsrData((prevState) => ({
        ...prevState,
        ssrProducts,
      }));
      setProducts(ssrProducts);
    }
  }, [activeCity, ssrProducts, ssrPremiumProducts]);

  useEffect(() => {
    if (ssrData) {
      setSsrData(null);
    }
  }, [fetchState, activeCity, isLoadingPremium, isLoadingNew]);

  useEffect(() => {
    if (ssrData) return;

    (async function fetchProducts() {
      setIsLoadingNew(true);
      try {
        const result = await API.get.product.list({
          window_host: window.location.origin,
          sort: sortObj.sort,
          filter: {
            published: 1,
            city_link: activeCity.id,
          },
          page: startFrom,
          limit: newPLimit,
        });
        setProducts(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingNew(false);
      }
    })();
  }, [activeCity, fetchState, sortObj]);

  useEffect(() => {
    if (ssrData) return;

    (async function fetchPremiumProducts() {
      setIsLoadingPremium(true);
      try {
        const result = await API.get.product.list({
          window_host: window.location.origin,
          sort: { stat_views_preview: "ASC" },
          limit: premPLimit,
          filter: {
            published: 1,
            premium: "!false",
            city_link: activeCity.id,
          },
          page: startFrom,
        });
        setPremiumProducts(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingPremium(false);
      }
    })();
  }, [activeCity, fetchState]);

  const productsCount = useProductsCount(
    useMemo(() => {
      return {
        published: 1,
        city_link: activeCity.id,
      };
    }, [activeCity])
  );

  return (
    <MotionContainer>
      {!DESKTOP && (
        <Container>
          <MenuWithIcons />
        </Container>
      )}

      <Hero />

      <Container>
        <div className="flex flex-row gap-x-2">
          <div className="flex-grow">
            {ssrPremiumProducts && activeCity.id == 5 && (
              <div className="relative pt-5 md:pt-8 lg:pt-[42px] lg:bg-transparent">
                <ProductContainerWithFetch
                  isTitleLoading={false}
                  title={`Премиум размещение – ${
                    ssrPremiumProductsCount?.count
                      ? ssrPremiumProductsCount.count
                      : 0
                  }`}
                  productsCount={ssrPremiumProductsCount?.count}
                  products={premiumProducts}
                  hotDeals={true}
                  isLoading={isLoadingPremium}
                  isLoadingCallback={setIsLoadingPremium}
                  preloaderAmount={premPLimit}
                  limit={premPLimit}
                  startFrom={startFrom}
                  callback={setPremiumProducts}
                  isHideSort={true}
                  isShowMap={true}
                />
              </div>
            )}

            <div
              className={
                ssrPremiumProducts && activeCity.id == 5
                  ? "lg:mb-3 w-full"
                  : "relative pt-5 md:pt-8 lg:pt-[42px] lg:bg-transparent"
              }
            >
              {!ssrPremiumProducts || !premiumProducts ? (
                <div className="border-b border-greyborder flex flex-col md:flex-row justify-between gap-2.5">
                  <H2
                    customClassName={
                      "text-primary text-xl md:text-[28px] font-semibold pb-[4px]"
                    }
                  >
                    Премиум размещение - 0
                  </H2>
                </div>
              ) : (
                ""
              )}

              <ProductContainerInfinite
                isTitleLoading={productsCount?.isLoading}
                title={`Новые предложения – ${productsCount?.products?.count}`}
                products={products}
                hotDeals={false}
                isLoading={isLoadingNew}
                isLoadingCallback={setIsLoadingNew}
                preloaderAmount={newPLimit}
                limit={newPLimit}
                startFrom={startFrom}
                callback={setProducts}
                isHideSort={false}
                sortCallback={(v) => setSortObj(v)}
                sortProps={{ defaultValue: "date_created-DESC" }}
              />
            </div>
          </div>

          <div className="py-5 md:py-8 lg:py-12">
            <Sidebar title={"Новости"}>
              <NewsContainer news={ssrNews} />
            </Sidebar>
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
