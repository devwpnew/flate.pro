import API from "pages/api/service/api";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import Link from "next/link";

import ProductContainerWithFetch from "../../product/components/template/productsContainerWithFetch";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import SearchResultEmpty from "@modules/search/components/part/searchResultEmpty";

import Sidebar from "@modules/sidebar/components/sidebar";
import MenuSidebar from "./sidebar/menuSidebar";
import FilterNew from "./filterNew";
import RcInformation from "./sidebar/rcInformation";
import UserInformation from "./sidebar/userInformation";

import useProductsCount from "hooks/products/useProductsCount";
import useFilterFields from "hooks/filter/useFilterFields";

import getLayout from "helpers/getLayout";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";
import ProductContainerInfinite from "../../product/components/template/productContainerInfinite";

export default function CategoryOutput({
  isRow,
  rcId,
  buildingId,
  userId,
  sectionId,
  productsAmountLoading,
  setProductsAmountCallback,
  setProductsAmountLoadingCallback,
  setIsFilter,
  sort,
  setSort,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { DESKTOP } = getLayout();

  const isSearchByUser = userId || router.query?.user;
  const isSearchByRc = rcId || router.query?.rc;
  const isSearchByBuilding = buildingId || router.query?.building;

  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const activeCity = useSelector((state) => state.userCity.value);
  const filterGlobalFields = useSelector(
    (state) => state.filterGlobalFields.value
  );

  const [isTemplateRow, setIsTemplateRow] = useState(false);

  const [isStartFilter, setIsStartFilter] = useState(isRow);

  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);

  const [premiumProducts, setPremiumProducts] = useState(null);
  const [products, setProducts] = useState(null);

  const productsCountParams = {
    published: 1,
    city_link: activeCity.id,
    section_relation: sectionId,
    ...filterGlobalFields,
  };

  if (isSearchByUser) {
    productsCountParams["user_id"] = isSearchByUser;
  }

  if (isSearchByRc) {
    productsCountParams["rc_link"] = isSearchByRc;
  }

  if (isSearchByBuilding) {
    productsCountParams["building_link"] = isSearchByBuilding;
  }

  const productsCountParamsValid = {};

  for (const name in productsCountParams) {
    if (productsCountParams[name] || productsCountParams[name] == 0) {
      productsCountParamsValid[name] = productsCountParams[name];
    }
  }

  console.log(productsCountParamsValid, "productsCountParamsValid");

  const productsCount = useProductsCount(
    useMemo(() => {
      return {
        ...productsCountParamsValid,
      };
    }, [
      fetchState,
      activeCity,
      isStartFilter,
      sectionId,
      rcId,
      buildingId,
      userId,
    ])
  );

  const premiumProductsCount = useProductsCount(
    useMemo(() => {
      return {
        published: 1,
        premium: "!false",
        city_link: activeCity.id,
        section_relation: sectionId,
      };
    }, [
      fetchState,
      activeCity,
      isStartFilter,
      sectionId,
      rcId,
      buildingId,
      userId,
    ])
  );

  const [productsCountAfterFilter, setProductsCountAfterFilter] =
    useState(null);

  const startFrom = 1;
  const newPLimit = 20;
  const premPLimit = 4;

  // ALL PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, [
    fetchState,
    activeCity,
    isStartFilter,
    sectionId,
    rcId,
    buildingId,
    userId,
    sort,
  ]);
  // console.log(productsCount, "productsCount");
  // ALL PRODUCTS COUNT TITLE
  useEffect(() => {
    setProductsAmountLoadingCallback(isLoadingNew);
    setProductsAmountCallback(productsCount?.products?.count);
    setProductsCountAfterFilter(productsCount?.products?.count);
    setProductsAmountLoadingCallback(isLoadingNew);
  }, [
    productsCount,
    fetchState,
    activeCity,
    isStartFilter,
    sectionId,
    rcId,
    buildingId,
    userId,
  ]);

  // PREM PRODUCTS
  useEffect(() => {
    (async function fetchPremiumProducts() {
      setIsLoadingPremium(true);
      const response = await API.get.product.list({
        window_host: window.location.origin,
        limit: premPLimit,
        sort: { stat_views_preview: "ASC" },
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
  }, [fetchState, activeCity, sectionId]);

  let layout = isTemplateRow || isRow;

  if ((!DESKTOP && isTemplateRow) || (!DESKTOP && isRow)) {
    layout = true;
  }

  const { propsFields, rangeFields } = useFilterFields(layout);

  useEffect(() => {
    if (isRow) return;
    setIsStartFilter(false);
    dispatch(setFilterGlobalFields({}));
  }, [router]);

  useEffect(() => {
    setIsFilter(isStartFilter);
  }, [isStartFilter]);

  async function fetchProducts() {
    setIsLoadingNew(true);
    setProducts([]);

    let sortParams = {};

    if (sort?.sort) {
      sortParams = sort.sort;
    } else {
      if (isRow || isStartFilter) {
        sortParams = { premium: "DESC", date_sort: "DESC" };
      } else {
        sortParams = { date_sort: "DESC" };
      }
    }

    // console.log(sortParams, "sortParams");

    const reqFields = {
      window_host: window.location.origin,
      sort: { ...sortParams },
      filter: {
        published: 1,
        city_link: activeCity.id,
        ...filterGlobalFields,
      },
      page: startFrom,
      limit: newPLimit,
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

    if (isSearchByBuilding) {
      reqFields["filter"]["building_link"] = isSearchByBuilding;
    }

    // console.log("reqFields", reqFields);

    const response = await API.get.product.list(reqFields);

    setProducts(response);
    setIsLoadingNew(false);

    // console.log(reqFields, "first fetch");
    // console.log(sortParams);
  }

  // console.log(filterGlobalFields, "filterGlobalFields category");

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar
        containerClassName={`${
          !layout && "hidden"
        } px-[15px] lg:px-[0px] lg:block lg:rounded lg:min-w-[235px] lg:w-[235px]`}
      >
        {!isSearchByUser && !isSearchByRc && (
          <>
            <MenuSidebar />
            {/* {isRow || isTemplateRow ? (
              <div className="flex flex-col">
                <FilterNew
                  isRow={isRow}
                  isSidebar={true}
                  setStartFilter={setIsStartFilter}
                  setIsTemplateRow={setIsTemplateRow}
                  propsFields={propsFields}
                  rangeFields={rangeFields}
                  productsAmountLoading={productsAmountLoading}
                  productsAmount={productsCountAfterFilter}
                />
              </div>
            ) : (
              ""
            )} */}
          </>
        )}
        {/* FOR USER */}
        {isSearchByUser && (
          <UserInformation key={isSearchByUser} userId={isSearchByUser} />
        )}
        {/* FOR RC */}
        {isSearchByRc && (
          <>
            <RcInformation key={isSearchByRc} rcId={isSearchByRc} />
            {/* <FilterNew
              isRow={isRow}
              isSidebar={true}
              setStartFilter={setIsStartFilter}
              setIsTemplateRow={setIsTemplateRow}
              propsFields={propsFields}
              rangeFields={rangeFields}
              productsAmountLoading={productsAmountLoading}
              productsAmount={productsCountAfterFilter}
            /> */}
          </>
        )}
      </Sidebar>

      <div className="w-full">
        <div className="pb-5">
          <FilterNew
            isRow={false}
            isSidebar={false}
            setStartFilter={setIsStartFilter}
            setIsTemplateRow={setIsTemplateRow}
            propsFields={propsFields}
            rangeFields={rangeFields}
            productsAmountLoading={productsAmountLoading}
            productsAmount={productsCountAfterFilter}
          />
        </div>

        {!isStartFilter ? (
          <div className="lg:flex flex-col">
            <div className="container mx-auto px-[15px] lg:px-[0]">
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
                startFrom={startFrom}
                callback={setPremiumProducts}
                isShowMap={true}
                isHideSort={true}
                sectionId={sectionId}
              />

              <ProductContainerWithFetch
                className={"col-start-1 col-end-2 row-start-2 lg:mb-3 w-full"}
                isTitleLoading={productsCount.isLoading}
                title={`Новые предложения - ${productsCount.products?.count}`}
                productsCount={productsCount.products?.count}
                products={products}
                hotDeals={false}
                isLoading={isLoadingNew}
                isLoadingCallback={setIsLoadingNew}
                preloaderAmount={newPLimit}
                limit={newPLimit}
                startFrom={startFrom}
                callback={setProducts}
                isHideSort={false}
                sortCallback={setSort}
                isShowMap={true}
                sectionId={sectionId}
              />
            </div>
          </div>
        ) : products ? (
          <div className="container mx-auto mt-12 lg:mt-0 px-[15px] lg:px-[0] w-full">
            <ProductContainerInfinite
              containerClassName={"flex flex-col gap-2.5 w-full"}
              layout="row"
              isTitleLoading={false}
              title={false}
              products={products}
              hotDeals={false}
              isLoading={isLoadingNew}
              isLoadingCallback={setIsLoadingNew}
              preloaderAmount={newPLimit}
              limit={newPLimit}
              startFrom={startFrom}
              callback={setProducts}
              sectionId={sectionId}
            />
          </div>
        ) : isLoadingNew ? (
          <div className="flex justify-center">
            <PreloaderSpinner />
          </div>
        ) : (
          <>
            <SearchResultEmpty isCentered={true} />
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
