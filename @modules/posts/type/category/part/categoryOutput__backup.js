import API from "pages/api/service/api";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";

import Link from "next/link";

import ProductContainerWithFetch from "../../product/components/template/productsContainerWithFetch";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import ProductsContainerRow from "../../product/components/template/productsContainerRow";
import SearchResultEmpty from "@modules/search/components/part/searchResultEmpty";
import ProductsEmpty from "../../product/components/part/productsEmpty";

import Sidebar from "@modules/sidebar/components/sidebar";
import MenuSidebar from "./sidebar/menuSidebar";
import FilterNew from "./filterNew";
import RcInformation from "./sidebar/rcInformation";
import UserInformation from "./sidebar/userInformation";

import useProductsCount from "hooks/products/useProductsCount";
import useFilterFields from "hooks/filter/useFilterFields";

import getLayout from "helpers/getLayout";

export default function CategoryOutput({
  isRow,
  rcId,
  userId,
  sectionId,
  productsAmountLoading,
  setProductsAmountCallback,
  setProductsAmountLoadingCallback,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { DESKTOP } = getLayout();

  const isSearchByUser = userId || router.query?.user;
  const isSearchByRc = rcId || router.query?.rc;

  const activeCity = useSelector((state) => state.userCity.value);
  const filterGlobalFields = useSelector(
    (state) => state.filterGlobalFields.value
  );

  
  const [isTemplateRow, setIsTemplateRow] = useState(false);

  
  const [isStartFilter, setIsStartFilter] = useState(isRow);

  const [isLoadingNew, setIsLoadingNew] = useState(true);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);

  const [premiumProducts, setPremiumProducts] = useState(null);
  const [products, setProducts] = useState(null);

  const productsCount = useProductsCount(
    useMemo(() => {
      return {
        published: 1,
        city_link: activeCity.id,
        section_relation: sectionId,
        ...filterGlobalFields,
      };
    }, [activeCity, isStartFilter, sectionId])
  );
  const premiumProductsCount = useProductsCount(
    useMemo(() => {
      return {
        published: 1,
        premium: "!false",
        city_link: activeCity.id,
        section_relation: sectionId,
      };
    }, [activeCity, sectionId])
  );

  const [productsCountAfterFilter, setProductsCountAfterFilter] =
    useState(null);

  const startFrom = 0;
  const newPLimit = 20;
  const premPLimit = 4;

  // ALL PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, [activeCity, isStartFilter, sectionId]);

  // ALL PRODUCTS COUNT TITLE
  useEffect(() => {
    setProductsAmountLoadingCallback(isLoadingNew);
    if (isStartFilter) {
      setProductsAmountCallback(products?.length);
      setProductsCountAfterFilter(products?.length);
    } else {
      setProductsAmountCallback(productsCount?.products?.count);
      setProductsCountAfterFilter(productsCount?.products?.count);
    }

    setProductsAmountLoadingCallback(isLoadingNew);
  }, [productsCount, isStartFilter]);

  // PREM PRODUCTS
  useEffect(() => {
    (async function fetchPremiumProducts() {
      setIsLoadingPremium(true);
      const response = await API.get.product.list({
        limit: premPLimit,
        sort: { stat_views: "DESC" },
        filter: {
          published: 1,
          premium: "!false",
          city_link: activeCity.id,
          section_relation: sectionId,
        },
        page: startFrom,
      });

      setPremiumProducts(response);
      setIsLoadingPremium(false);
    })();

    // return function cleanup() {
    //   setPremiumProducts(null);
    // };
  }, [activeCity, sectionId]);

  const { propsFields, rangeFields } = useFilterFields(isStartFilter || isRow);

  useEffect(() => {
    setIsStartFilter(false);
  }, [router]);

  async function fetchProducts() {
    setIsLoadingNew(true);

    const reqFields = {
      window_host: window.location.origin,
      sort: { date_sort: "DESC" },
      filter: {
        published: 1,
        city_link: activeCity.id,
        ...filterGlobalFields,
      },
      page: startFrom,
      limit: isStartFilter || isRow ? "all" : newPLimit,
    };


    if (sectionId) {
      reqFields["filter"]["section_relation"] = sectionId;
    }

    if (isSearchByUser) {
      reqFields["filter"]["user_id"] = isSearchByUser;
    }

    if (isSearchByRc) {
      reqFields["filter"]["rc_link"] = isSearchByRc;
    }

    const response = await API.get.product.list(reqFields);

    setProducts(response);
    setIsLoadingNew(false);
  }
  
  // console.log(filterGlobalFields);

  return (
    <>
      {DESKTOP && (
        <Sidebar>
          {!isSearchByUser && !isSearchByRc && (
            <>
              <MenuSidebar />
              {isStartFilter || isRow ? (
                <div className="flex flex-col">
                  <FilterNew
                    isRow={isRow}
                    isSidebar={true}
                    setStartFilter={setIsStartFilter}
                    propsFields={propsFields}
                    rangeFields={rangeFields}
                    productsAmountLoading={productsAmountLoading}
                    productsAmount={productsCountAfterFilter}
                  />
                </div>
              ) : (
                ""
              )}
            </>
          )}

          {isSearchByUser && <UserInformation userId={isSearchByUser} />}
          {isSearchByRc && (
            <>
              <RcInformation rcId={isSearchByRc} />
              <FilterNew
                isRow={isRow}
                isSidebar={true}
                setStartFilter={setIsStartFilter}
                propsFields={propsFields}
                rangeFields={rangeFields}
                productsAmountLoading={productsAmountLoading}
                productsAmount={productsCountAfterFilter}
              />
            </>
          )}
        </Sidebar>
      )}

      <div id="category-container" className="w-full">
        {!isStartFilter && !isRow ? (
          <div className="lg:flex flex-col">
            <div className="pb-5">
              <FilterNew
                isRow={isRow}
                isSidebar={false}
                setStartFilter={setIsStartFilter}
                propsFields={propsFields}
                rangeFields={rangeFields}
                productsAmountLoading={productsAmountLoading}
                productsAmount={productsCountAfterFilter}
              />
            </div>

            <ProductContainerWithFetch
              className={
                "hot-deals col-start-1 col-end-2 row-span-1 lg:bg-transparent"
              }
              isTitleLoading={premiumProductsCount.isLoading}
              title={`Премиум размещение - ${premiumProductsCount.products?.count}`}
              productsCount={premiumProductsCount.products?.count}
              products={premiumProducts}
              hotDeals={true}
              isLoading={isLoadingPremium}
              isLoadingCallback={setIsLoadingPremium}
              preloaderAmount={premPLimit}
              limit={premPLimit}
              startFrom={2}
              callback={setPremiumProducts}
              isShowMap={true}
              isHideSort={true}
            />

            <ProductContainerWithFetch
              className={"col-start-1 col-end-2 row-start-2 lg:mb-3 w-full"}
              isTitleLoading={productsCount.isLoading}
              title={`Новые предложения - ${productsCount.products?.count}`}
              productsCount={premiumProductsCount.products?.count}
              products={products}
              hotDeals={false}
              isLoading={isLoadingNew}
              isLoadingCallback={setIsLoadingNew}
              preloaderAmount={newPLimit}
              limit={newPLimit}
              startFrom={2}
              callback={setProducts}
              isShowMap={true}
            />
          </div>
        ) : isLoadingNew ? (
          <div className="flex justify-center">
            <PreloaderSpinner />
          </div>
        ) : products ? (
          <ProductsContainerRow
            isSearchByUser={isSearchByUser}
            products={products}
            amount={products?.length}
            callback={setProducts}
          />
        ) : isLoadingNew ? (
          <div className="flex justify-center">
            <PreloaderSpinner />
          </div>
        ) : (
          <>
            <SearchResultEmpty />
            <div className="text-center mt-5">
              <Link href="/user/profile/add">
                <a className="text-blue text-xl font-semibold hover:text-bluedeep">
                  Разместить объявление →
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
