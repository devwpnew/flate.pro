import API from "pages/api/service/api";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";

import H1 from "@modules/common/components/heading/h1";

import Sidebar from "@modules/sidebar/components/sidebar";
import SearchMobile from "./searchMobile";
import SearchForm from "./searchForm";
import MenuSidebar from "@modules/posts/type/category/part/sidebar/menuSidebar";
import Filter from "@modules/posts/type/category/part/filter";
import FilterHouses from "@modules/posts/type/category/part/filterHouses";
import FilterCommertion from "@modules/posts/type/category/part/filterCommertion";
import FilterSidebar from "@modules/posts/type/category/part/sidebar/filterSidebar";
import BackButton from "@modules/common/components/button/backButton";
import SearchResultOutput from "./part/searchResultOutput";
import SearchResultEmpty from "./part/searchResultEmpty";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import declension from "helpers/formatters/declension";
import randomInteger from "helpers/randomInteger";
import getLayout from "helpers/getLayout";

import Sort from "@modules/posts/type/category/part/sort";
import FilterPlace from "@modules/posts/type/category/part/filterPlace";
import FilterParkings from "@modules/posts/type/category/part/filterParkings";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";
export default function SearchTemplate({
  section,
  products,
  city,
  district,
  sortCallback,
  byUser,
  byRc,
}) {
  const { DESKTOP, LAPTOP_MOBILE, DESK_VARIANTS } = getLayout();
  const dispatch = useDispatch();
  const router = useRouter();
  const slug = router.query.section_slug;

  const userId = router.query.user;
  const rc = router.query.rc;

  const isPlacePage = router.query.sections === "5";
  const isFlatsPage = router.query.sections === "3";
  const isHousesPage = router.query.sections === "4";
  const isCommertionPage = router.query.sections === "6";
  const isParkingPage = router.query.sections === "7";

  const sectionId = section ? section[0].id : null;

  const [prodSort, setProdSort] = useState({ date_sort: "desc" });

  const [runFilter, setRunFilter] = useState(false);

  const [isFilteredProductsLoading, setFilteredProductsLoading] =
    useState(false);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filteredProductsCount, setFilteredProductsCount] = useState(0);
  // const [filteredHotProducts, setFilteredHotProducts] = useState(null);
  const [priceRangeValue, setPriceRangeValue] = useState(null);
  const [squaresRangeValue, setSquaresRangeValue] = useState(null);
  const [areaValue, setAreaValue] = useState(null);
  const [mortgageValue, setMortgage] = useState(null);

  const [status, setStatus] = useState(null);
  const [floorRangeValue, setFloorRangeValue] = useState(null);
  const [sumContractValue, setSumContractValue] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [handedOver, setHandedOver] = useState(null);
  const [repairmentValue, setRepairment] = useState(null);

  const [landSquaresMax, setLandSquaresMax] = useState(null);
  const [livingSquaresMax, setLivingSquaresMax] = useState(null);
  const [houseTypes, setHouseTypes] = useState(null);
  const [houseConstruction, setHouseConstruction] = useState(null);
  const [houseCommunication, setHouseCommunication] = useState(null);
  const [houseFloors, setHouseFloors] = useState(null);

  const [parkingTypes, setParkingTypes] = useState(null);
  const [commercialTypes, setCommercialTypes] = useState(null);
  const [statusLands, setStatusLands] = useState(null);

  const [queryAreas, setQueryAreas] = useState(null);

  const activeCity = useSelector((state) => state.userCity.value);
  const fetchState = useSelector((state) => state.fetchTrigger.value);

  const [fiterKey, setFiterKey] = useState(10000);
  // unset filter if url changes
  useEffect(() => {
    (async function unsetFilter() {
      setRunFilter(false);
      // setFilteredHotProducts(null);
      setFilteredProducts(null);

      dispatch(setFilterGlobalFields({}));
    })();
  }, [router]);

  useEffect(() => {
    (async function sortProducts() {
      if (runFilter && runFilter.includes("run")) {
        filterStart();
      }
    })();
  }, [runFilter]);

  useEffect(() => {
    (async function sortProducts() {
      filterStart();
    })();
  }, [fetchState, activeCity]);

  function changeSort(event) {
    let sort;
    if (typeof event == "function") {
      const callbackEvent = event();
      if (callbackEvent) {
        if (callbackEvent.name && callbackEvent.value != null) {
          sort = callbackEvent.value;
        }
      }
    } else if (event) {
      if (event.target) {
        if (event.target.value) {
          sort = event.target.value;
        }
      }
    }
    if (sort) {
      const sortArr = sort.split("-");
      let sortObj = {};
      sortObj[sortArr[0]] = sortArr[1];
      setProdSort(sortObj);
    }
  }

  async function filterStart() {
    setFilteredProductsLoading(true);
    const filterFields = {};

    if (activeCity && activeCity.id !== null) {
      filterFields["city_link"] = activeCity.id;
    }

    if (priceRangeValue) {
      const minPrice = priceRangeValue[1];
      const maxPrice = priceRangeValue[0];

      filterFields["product_price"] = { from: minPrice, to: maxPrice };
    }

    if (squaresRangeValue) {
      const minSquares = squaresRangeValue[1];
      const maxSquares = squaresRangeValue[0];

      if (router.query.section_slug === "place") {
        filterFields["land_squares"] = { from: minSquares, to: maxSquares };
      } else {
        filterFields["living_squares"] = {
          from: minSquares,
          to: maxSquares,
        };
      }
    }

    if (status && status.length !== 0) {
      filterFields["status"] = status.length === 1 ? status[0] : status;
    }

    if (rooms && rooms.length !== 0) {
      filterFields["product_room_count"] =
        rooms.length === 1 ? rooms[0] : rooms;
    }

    if (router.query.areas && !areaValue) {
      const queryAreas = [];
      await Promise.all(
        router.query.areas.split(",").map(async (area) => {
          queryAreas.push(area);
        })
      );

      // setAreaValue(queryAreas);

      if (queryAreas) {
        filterFields["area_link"] = queryAreas;
      }
    }

    if(router.query.products) {
      const queryProducts = [];
      await Promise.all(
        router.query.products.split(",").map(async (id) => {
          queryProducts.push(id);
        })
      );

      if (queryProducts) {
        filterFields["id"] = queryProducts;
      }
    }

    if (userId) {
      filterFields["user_id"] = parseInt(userId);
    }

    if (rc) {
      filterFields["rc_link"] = rc;
    }

    if (areaValue && areaValue.length !== 0) {
      filterFields["area_link"] = areaValue;
    }

    if (mortgageValue && mortgageValue.id) {
      filterFields["mortgage"] = mortgageValue.id;
    }

    if (sumContractValue && sumContractValue.id) {
      filterFields["sum_contract"] = sumContractValue.id;
    }

    if (floorRangeValue) {
      const minFloor = floorRangeValue[1];
      const maxFloor = floorRangeValue[0];

      filterFields["property_product_floor"] = {
        from: minFloor,
        to: maxFloor,
      };
    }

    if (landSquaresMax) {
      const minSquares = landSquaresMax[1];
      const maxSquares = landSquaresMax[0];
      filterFields["land_squares"] = { from: minSquares, to: maxSquares };
    }

    if (livingSquaresMax) {
      const minSquares = livingSquaresMax[1];
      const maxSquares = livingSquaresMax[0];
      filterFields["living_squares"] = {
        from: minSquares,
        to: maxSquares,
      };
    }

    if (houseTypes && houseTypes.length !== 0) {
      filterFields["house_types"] = houseTypes;
    }

    if (houseConstruction && houseConstruction.length !== 0) {
      filterFields["house_construction"] = houseConstruction;
    }

    if (houseCommunication && houseCommunication.length !== 0) {
      filterFields["house_communication"] = houseCommunication;
    }

    if (houseFloors && houseFloors.length !== 0) {
      filterFields["house_floors"] = houseFloors;
    }

    if (parkingTypes && parkingTypes.length !== 0) {
      filterFields["parking_types"] = parkingTypes;
    }

    if (commercialTypes && commercialTypes.length !== 0) {
      filterFields["commercial_types"] = commercialTypes;
    }

    if (statusLands && statusLands.length !== 0) {
      filterFields["status_lands"] = statusLands;
    }

    if (sectionId) {
      filterFields["section_relation"] = sectionId;
    }

    setFilteredProducts(
      await API.get.product.list({
        window_host: window.location.origin,
        filter: {
          published: "1",
          ...filterFields,
        },
        limit: "all",
        sort: prodSort,
      })
    );

    // setFilteredHotProducts(
    //   await API.get.product.list({
    //     window_host: window.location.origin,
    //     filter: {
    //       section_relation: sectionId,
    //       published: "1",
    //       premium: "!0",
    //       ...filterFields,
    //     },
    //     limit: 4,
    //   })
    // );

    dispatch(setFilterGlobalFields(filterFields));
    setFilteredProductsLoading(false);
  }
  return (
    <MotionContainer variants={DESK_VARIANTS}>
      <div className="bg-greylight p-4 border-b-[1px] border-greyborder flex">
        {!DESKTOP && <BackButton />}
        <Container>
          {LAPTOP_MOBILE ? (
            <div className="flex justify-center items-center">
              <span className="font-bold text-base">Поиск</span>
            </div>
          ) : (
            <SearchForm />
          )}
        </Container>
      </div>

      <Container>
        <div className="flex flex-row justify-between items-end pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
          {/* <H1>{section ? section[0].meta_h1 : "Недвижимость"} в Сочи {byUser && `от пользователя ${byUser.user_name}`} {byRc && `в ${byRc.name}`}</H1> */}
          <H1>Поиск</H1>

          {filteredProducts && filteredProducts.length !== 0 && (
            <Sort addCallback={changeSort} />
          )}
        </div>
      </Container>

      {/* START FILTER */}
      <div className="bg-greylight py-4 lg:shadow rounded lg:hidden">
        <Container>
          {isFlatsPage && (
            <Filter
              key={fiterKey}
              setFiterKeyCallback={setFiterKey}
              productsSum={
                filteredProducts
                  ? filteredProducts.length
                  : products && products.length
              }
              sectionId={sectionId}
              runFilterCallback={() => setRunFilter(`run-${randomInteger()}`)}
              priceCallback={setPriceRangeValue}
              squaresCallback={setSquaresRangeValue}
              areasCallback={setAreaValue}
              mortgageCallback={setMortgage}
              statusCallback={setStatus}
              floorCallback={setFloorRangeValue}
              sumContractCallback={setSumContractValue}
              roomsCallback={setRooms}
              handedOverCallback={setHandedOver}
              repairmentCallback={setRepairment}
            />
          )}

          {isHousesPage && (
            <FilterHouses
              key={fiterKey}
              setFiterKeyCallback={setFiterKey}
              productsSum={
                filteredProducts
                  ? filteredProducts.length
                  : products && products.length
              }
              sectionId={sectionId}
              runFilterCallback={() => setRunFilter(`run-${randomInteger()}`)}
              priceCallback={setPriceRangeValue}
              squaresCallback={setSquaresRangeValue}
              areasCallback={setAreaValue}
              mortgageCallback={setMortgage}
              statusCallback={setStatus}
              floorCallback={setFloorRangeValue}
              sumContractCallback={setSumContractValue}
              roomsCallback={setRooms}
              landSquaresMaxCallback={setLandSquaresMax}
              livingSquaresMaxCallback={setLivingSquaresMax}
              houseTypesCallback={setHouseTypes}
              houseConstructionCallback={setHouseConstruction}
              houseCommunicationCallback={setHouseCommunication}
              houseFloorsCallback={setHouseFloors}
              handedOverCallback={setHandedOver}
              repairmentCallback={setRepairment}
            />
          )}

          {isPlacePage && (
            <FilterPlace
              key={fiterKey}
              setFiterKeyCallback={setFiterKey}
              productsSum={
                filteredProducts
                  ? filteredProducts.length
                  : products && products.length
              }
              sectionId={sectionId}
              runFilterCallback={() => setRunFilter(`run-${randomInteger()}`)}
              priceCallback={setPriceRangeValue}
              squaresCallback={setSquaresRangeValue}
              areasCallback={setAreaValue}
              mortgageCallback={setMortgage}
              statusCallback={setStatus}
              floorCallback={setFloorRangeValue}
              sumContractCallback={setSumContractValue}
              roomsCallback={setRooms}
              landSquaresMaxCallback={setLandSquaresMax}
              livingSquaresMaxCallback={setLivingSquaresMax}
              houseTypesCallback={setHouseTypes}
              houseConstructionCallback={setHouseConstruction}
              houseCommunicationCallback={setHouseCommunication}
              houseFloorsCallback={setHouseFloors}
              statusLandsCallback={setStatusLands}
              handedOverCallback={setHandedOver}
              repairmentCallback={setRepairment}
            />
          )}

          {isCommertionPage && (
            <FilterCommertion
              key={fiterKey}
              setFiterKeyCallback={setFiterKey}
              productsSum={
                filteredProducts
                  ? filteredProducts.length
                  : products && products.length
              }
              sectionId={sectionId}
              runFilterCallback={() => setRunFilter(`run-${randomInteger()}`)}
              priceCallback={setPriceRangeValue}
              squaresCallback={setSquaresRangeValue}
              areasCallback={setAreaValue}
              mortgageCallback={setMortgage}
              statusCallback={setStatus}
              floorCallback={setFloorRangeValue}
              sumContractCallback={setSumContractValue}
              roomsCallback={setRooms}
              landSquaresMaxCallback={setLandSquaresMax}
              livingSquaresMaxCallback={setLivingSquaresMax}
              houseTypesCallback={setHouseTypes}
              houseConstructionCallback={setHouseConstruction}
              houseCommunicationCallback={setHouseCommunication}
              houseFloorsCallback={setHouseFloors}
              commercialTypesCallback={setCommercialTypes}
              handedOverCallback={setHandedOver}
              repairmentCallback={setRepairment}
            />
          )}

          {isParkingPage && (
            <FilterParkings
              key={fiterKey}
              setFiterKeyCallback={setFiterKey}
              productsSum={
                filteredProducts
                  ? filteredProducts.length
                  : products && products.length
              }
              sectionId={sectionId}
              runFilterCallback={() => setRunFilter(`run-${randomInteger()}`)}
              priceCallback={setPriceRangeValue}
              squaresCallback={setSquaresRangeValue}
              areasCallback={setAreaValue}
              mortgageCallback={setMortgage}
              statusCallback={setStatus}
              floorCallback={setFloorRangeValue}
              sumContractCallback={setSumContractValue}
              roomsCallback={setRooms}
              landSquaresMaxCallback={setLandSquaresMax}
              livingSquaresMaxCallback={setLivingSquaresMax}
              houseTypesCallback={setHouseTypes}
              houseConstructionCallback={setHouseConstruction}
              houseCommunicationCallback={setHouseCommunication}
              houseFloorsCallback={setHouseFloors}
              parkingTypesCallback={setParkingTypes}
              commercialTypesCallback={setCommercialTypes}
              handedOverCallback={setHandedOver}
              repairmentCallback={setRepairment}
            />
          )}

          {!isFlatsPage &&
            !isHousesPage &&
            !isPlacePage &&
            !isCommertionPage &&
            !isParkingPage && (
              <>
                <Filter
                  key={fiterKey}
                  setFiterKeyCallback={setFiterKey}
                  productsSum={
                    filteredProducts
                      ? filteredProducts.length
                      : products && products.length
                  }
                  sectionId={sectionId}
                  runFilterCallback={() =>
                    setRunFilter(`run-${randomInteger()}`)
                  }
                  priceCallback={setPriceRangeValue}
                  squaresCallback={setSquaresRangeValue}
                  areasCallback={setAreaValue}
                  mortgageCallback={setMortgage}
                  statusCallback={setStatus}
                  floorCallback={setFloorRangeValue}
                  sumContractCallback={setSumContractValue}
                  roomsCallback={setRooms}
                  handedOverCallback={setHandedOver}
                  repairmentCallback={setRepairment}
                />
              </>
            )}
        </Container>
      </div>
      {/* END FILTER */}

      <div className="mt-4">
        <Container>
          <div className="flex justify-between gap-2.5">
            {/* START SIDEBAR */}
            <Sidebar>
              <MenuSidebar />
              {isFlatsPage && (
                <Filter
                  key={fiterKey}
                  setFiterKeyCallback={setFiterKey}
                  isSidebar={true}
                  sectionId={sectionId}
                  runFilterCallback={() =>
                    setRunFilter(`run-${randomInteger()}`)
                  }
                  priceCallback={setPriceRangeValue}
                  squaresCallback={setSquaresRangeValue}
                  areasCallback={setAreaValue}
                  mortgageCallback={setMortgage}
                  statusCallback={setStatus}
                  floorCallback={setFloorRangeValue}
                  sumContractCallback={setSumContractValue}
                  roomsCallback={setRooms}
                  repairmentCallback={setRepairment}
                  handedOverCallback={setHandedOver}
                />
              )}

              {isHousesPage && (
                <FilterHouses
                  isSidebar={true}
                  sectionId={sectionId}
                  runFilterCallback={() =>
                    setRunFilter(`run-${randomInteger()}`)
                  }
                  priceCallback={setPriceRangeValue}
                  squaresCallback={setSquaresRangeValue}
                  areasCallback={setAreaValue}
                  mortgageCallback={setMortgage}
                  statusCallback={setStatus}
                  floorCallback={setFloorRangeValue}
                  sumContractCallback={setSumContractValue}
                  roomsCallback={setRooms}
                  landSquaresMaxCallback={setLandSquaresMax}
                  livingSquaresMaxCallback={setLivingSquaresMax}
                  houseTypesCallback={setHouseTypes}
                  houseConstructionCallback={setHouseConstruction}
                  houseCommunicationCallback={setHouseCommunication}
                  houseFloorsCallback={setHouseFloors}
                  repairmentCallback={setRepairment}
                />
              )}

              {isPlacePage && (
                <FilterPlace
                  isSidebar={true}
                  sectionId={sectionId}
                  runFilterCallback={() =>
                    setRunFilter(`run-${randomInteger()}`)
                  }
                  priceCallback={setPriceRangeValue}
                  squaresCallback={setSquaresRangeValue}
                  areasCallback={setAreaValue}
                  mortgageCallback={setMortgage}
                  statusCallback={setStatus}
                  floorCallback={setFloorRangeValue}
                  sumContractCallback={setSumContractValue}
                  roomsCallback={setRooms}
                  landSquaresMaxCallback={setLandSquaresMax}
                  livingSquaresMaxCallback={setLivingSquaresMax}
                  houseTypesCallback={setHouseTypes}
                  houseConstructionCallback={setHouseConstruction}
                  houseCommunicationCallback={setHouseCommunication}
                  houseFloorsCallback={setHouseFloors}
                  statusLandsCallback={setStatusLands}
                />
              )}

              {isCommertionPage && (
                <FilterCommertion
                  key={fiterKey}
                  setFiterKeyCallback={setFiterKey}
                  isSidebar={true}
                  sectionId={sectionId}
                  runFilterCallback={() =>
                    setRunFilter(`run-${randomInteger()}`)
                  }
                  priceCallback={setPriceRangeValue}
                  squaresCallback={setSquaresRangeValue}
                  areasCallback={setAreaValue}
                  mortgageCallback={setMortgage}
                  statusCallback={setStatus}
                  floorCallback={setFloorRangeValue}
                  sumContractCallback={setSumContractValue}
                  roomsCallback={setRooms}
                  landSquaresMaxCallback={setLandSquaresMax}
                  livingSquaresMaxCallback={setLivingSquaresMax}
                  houseTypesCallback={setHouseTypes}
                  houseConstructionCallback={setHouseConstruction}
                  houseCommunicationCallback={setHouseCommunication}
                  houseFloorsCallback={setHouseFloors}
                  commercialTypesCallback={setCommercialTypes}
                />
              )}

              {isParkingPage && (
                <FilterParkings
                  key={fiterKey}
                  setFiterKeyCallback={setFiterKey}
                  isSidebar={true}
                  sectionId={sectionId}
                  runFilterCallback={() =>
                    setRunFilter(`run-${randomInteger()}`)
                  }
                  priceCallback={setPriceRangeValue}
                  squaresCallback={setSquaresRangeValue}
                  areasCallback={setAreaValue}
                  mortgageCallback={setMortgage}
                  statusCallback={setStatus}
                  floorCallback={setFloorRangeValue}
                  sumContractCallback={setSumContractValue}
                  roomsCallback={setRooms}
                  landSquaresMaxCallback={setLandSquaresMax}
                  livingSquaresMaxCallback={setLivingSquaresMax}
                  houseTypesCallback={setHouseTypes}
                  houseConstructionCallback={setHouseConstruction}
                  houseCommunicationCallback={setHouseCommunication}
                  houseFloorsCallback={setHouseFloors}
                  parkingTypesCallback={setParkingTypes}
                  commercialTypesCallback={setCommercialTypes}
                />
              )}
            </Sidebar>
            {/* END SIDEBAR */}

            {/* START SEARCH RESULT */}
            <div className="flex flex-col w-full">
              {!isFilteredProductsLoading ? (
                filteredProducts &&
                filteredProducts.length !== 0 && (
                  <SearchResultOutput
                    key={randomInteger()}
                    products={filteredProducts}
                    amount={
                      filteredProducts &&
                      filteredProducts.length !== 0 &&
                      filteredProducts.length
                    }
                    sortCallback={sortCallback}
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <PreloaderSpinner />
                </div>
              )}
              {filteredProducts && filteredProducts.length === 0 && (
                <SearchResultEmpty />
              )}
            </div>
            {/* END SEARCH RESULT */}
          </div>
        </Container>
      </div>
    </MotionContainer>
  );
}
