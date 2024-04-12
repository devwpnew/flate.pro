import API from "pages/api/service/api";
import Image from "next/image";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import closeIcon from "public/icons/close-blue.svg";

import Container from "@modules/common/components/container/container";
import Preloader from "@modules/common/components/preloader/preloader";
import Button from "@modules/common/components/button/button";

import RangeSlider from "@modules/common/components/range/range-slider";

import CitySelect from "@modules/location/components/button/select";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import SelectLinks from "@modules/common/components/select/listBox/selectLinks";

import AreasDropdown from "@modules/common/components/dropdown/areasDropdown";

import getLayout from "helpers/getLayout";
import declension from "helpers/formatters/declension";
import randomInteger from "helpers/randomInteger";

import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";
export default function Filter({
  isSidebar,
  productsSum,
  sectionId,
  mortgageCallback,
  priceCallback,
  squaresCallback,
  areasCallback,
  runFilterCallback,
  statusCallback,
  floorCallback,
  sumContractCallback,
  roomsCallback,
  repairmentCallback,
  handedOverCallback,
  setFiterKeyCallback,
  setGlobalMortgage,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const filterGlobalFields = useSelector(
    (state) => state.filterGlobalFields.value
  );

  const slug = router.query.section_slug;
  const isLandPage = slug === "place" || parseInt(router.query.sections) === 5;

  const { MOBILE } = getLayout();

  const activeCity = useSelector((state) => state.userCity.value);

  const [showMore, setShowMore] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [res, setSearchResult] = useState(null);
  const [sections, setSections] = useState(null);

  const [isSquaresLoading, setSquaresLoading] = useState(true);
  const [squaresMin, setSquaresMin] = useState(null);
  const [squaresMax, setSquaresMax] = useState(null);

  const [isPriceLoading, setPriceLoading] = useState(true);

  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);

  const [areaIds, setAreaIds] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [theHand, setTheHand] = useState(null);
  const [sumContract, setSumContract] = useState(null);
  const [mortgage, setMortgage] = useState(null);
  const [repairment, setRepairment] = useState(null);
  const [rooms, setRooms] = useState(null);

  // product_room_count
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "product_room_count");

      if (options) {
        const optionsNew = [];
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setRooms(optionsNew);
      }
    })();
  }, []);
  // repairment
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "repairment");

      if (options) {
        const optionsNew = [];

        optionsNew.push({ name: "Неважно", id: null });

        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setRepairment(optionsNew);
      }
    })();
  }, []);
  // status
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "status");

      if (options) {
        const optionsNew = [];
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setStatuses(optionsNew);
      }
    })();
  }, []);
  // handed_over
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "handed_over");

      if (options) {
        const optionsNew = [];
        optionsNew.push({ name: "Неважно", id: null });
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setTheHand(optionsNew);
      }
    })();
  }, []);
  // sum_contract
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "sum_contract");

      if (options) {
        const optionsNew = [];
        optionsNew.push({ name: "Неважно", id: null });
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setSumContract(optionsNew);
      }
    })();
  }, []);
  // mortgage
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "mortgage");

      if (options) {
        const optionsNew = [];
        optionsNew.push({ name: "Неважно", id: null });
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setMortgage(optionsNew);
      }
    })();
  }, []);

  // SECTIONS AND AREAS
  useEffect(() => {
    (async function fetchData() {
      setLoading(true);
      setSections(
        await API.get.sections({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
          filter: {
            active: true,
          },
        })
      );
      setLoading(false);
    })();
  }, [activeCity]);

  // MIN MAX SQUARES
  useEffect(() => {
    (async function fetchSquares() {
      const selectProps = ["id"];
      const sortProps = { asc: {}, desc: {} };

      // Если земля то фильтруем по площади земли
      if (isLandPage) {
        selectProps.push("land_squares");
        sortProps.desc["land_squares"] = "desc";
        sortProps.asc["land_squares"] = "asc";
      } else {
        selectProps.push("living_squares");
        sortProps.desc["living_squares"] = "desc";
        sortProps.asc["living_squares"] = "asc";
      }

      setSquaresMin(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: selectProps,
          sort: sortProps.asc,
          limit: 1,
        })
      );

      setSquaresMax(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: selectProps,
          sort: sortProps.desc,
          limit: 1,
        })
      );

      setSquaresLoading(false);
    })();
  }, [router.asPath]);

  // MIN MAX PRICE
  useEffect(() => {
    (async function fetchSquares() {
      setPriceMin(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: ["id", "product_price"],
          sort: { product_price: "asc" },
          limit: 1,
        })
      );

      setPriceMax(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: ["id", "product_price"],
          sort: { product_price: "desc" },
          limit: 1,
        })
      );

      setPriceLoading(false);
    })();
  }, [router.asPath]);

  const cleanFilter = async () => {
    dispatch(setFilterGlobalFields({}));
    await setFiterKeyCallback(randomInteger());
  };

  useEffect(() => {
    if (filterGlobalFields && filterGlobalFields.area_link) {
      setAreaIds(filterGlobalFields.area_link);
    }
  }, []);


  console.log(filterGlobalFields, 'filterGlobalFields');

  return (
    <>
      {isLoading ? (
        <div className="h-[170px] overflow-hidden">
          <Preloader />
        </div>
      ) : (
        <div
          className={`bg-greylight py-4 lg:shadow rounded ${
            isSidebar ? "bg-greylight py-4 lg:shadow-none rounded-none" : ""
          }`}
        >
          <Container className={isSidebar ? "w-full px-0" : ""} key={sectionId}>
            <div className="flex flex-col gap-2 mb-2">
              <div
                className={`flex flex-col gap-2 md:flex-row md:flex-wrap ${
                  isSidebar ? "flex-col" : ""
                }`}
              >
                <div
                  className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                    isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                  }`}
                >
                  <span className="hidden md:block text-grey text-sm">Тип</span>
                  {sections && (
                    <SelectLinks style={"w-full h-12"} options={sections} />
                  )}
                </div>

                <div
                  className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                    isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                  }`}
                >
                  <span className="hidden md:block text-grey text-sm">
                    Статус
                  </span>
                  {statuses && (
                    <SelectMultiSelect
                      options={statuses}
                      defaultValue={
                        filterGlobalFields.status
                          ? filterGlobalFields.status
                          : ""
                      }
                      style={"w-full h-12"}
                      callback={statusCallback}
                    />
                  )}
                </div>

                {isSidebar && (
                  <div
                    className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                  >
                    <span className="hidden md:block text-grey text-sm">
                      Дом сдан
                    </span>
                    {theHand && (
                      <SelectNoAutocomplete
                        options={theHand}
                        name={"handed-over"}
                        style={"h-12"}
                        callback={handedOverCallback}
                      />
                    )}
                  </div>
                )}

                {isSidebar && (
                  <div
                    className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                  >
                    <span className="hidden md:block text-grey text-sm">
                      Этаж
                    </span>
                    <RangeSlider
                      callback={floorCallback}
                      // key={randomInteger()}
                      min={1}
                      max={100}
                      valueMin={
                        filterGlobalFields.property_product_floor
                          ? filterGlobalFields.property_product_floor.from
                          : ""
                      }
                      valueMax={
                        filterGlobalFields.property_product_floor
                          ? filterGlobalFields.property_product_floor.to
                          : ""
                      }
                      name="Этаж"
                    />
                  </div>
                )}

                {isSidebar && (
                  <div
                    className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                  >
                    <span className="hidden md:block text-grey text-sm">
                      Количество комнат
                    </span>
                    {rooms && (
                      <SelectMultiSelect
                        options={rooms}
                        style={"h-12"}
                        callback={roomsCallback}
                      />
                    )}
                  </div>
                )}

                {isSidebar && (
                  <div
                    className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                  >
                    <span className="hidden md:block text-grey text-sm">
                      Сумма в договоре
                    </span>
                    {sumContract && (
                      <SelectNoAutocomplete
                        options={sumContract}
                        style={"h-12"}
                        callback={sumContractCallback}
                      />
                    )}
                  </div>
                )}

                {!MOBILE ? (
                  <>
                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Площадь, м²
                      </span>
                      {isSquaresLoading ? (
                        <Preloader />
                      ) : (
                        <RangeSlider
                          callback={squaresCallback}
                          key={
                            squaresMax && squaresMax.living_squares
                              ? squaresMax.living_squares
                              : squaresMax && squaresMax.land_squares
                          }
                          min={0}
                          max={
                            squaresMax && squaresMax.living_squares
                              ? squaresMax.living_squares
                              : squaresMax && squaresMax.land_squares
                          }
                          valueMin={
                            filterGlobalFields.living_squares
                              ? filterGlobalFields.living_squares.from
                              : ""
                          }
                          valueMax={
                            filterGlobalFields.living_squares
                              ? filterGlobalFields.living_squares.to
                              : ""
                          }
                          name="Площадь, м²"
                        />
                      )}
                    </div>
                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Цена, руб
                      </span>
                      {isPriceLoading ? (
                        <Preloader />
                      ) : (
                        <RangeSlider
                          callback={priceCallback}
                          key={priceMax && priceMax.product_price}
                          min={0}
                          max={priceMax && priceMax.product_price}
                          valueMin={
                            filterGlobalFields.product_price
                              ? filterGlobalFields.product_price.from
                              : ""
                          }
                          valueMax={
                            filterGlobalFields.product_price
                              ? filterGlobalFields.product_price.to
                              : ""
                          }
                          name="Цена, руб"
                        />
                      )}
                    </div>
                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Ипотека
                      </span>
                      {mortgage && (
                        <SelectNoAutocomplete
                          style={"w-full h-12"}
                          name={"ismortgage"}
                          options={mortgage}
                          callback={mortgageCallback}
                          defaultValue={
                            filterGlobalFields.mortgage
                              ? filterGlobalFields.mortgage
                              : ""
                          }
                        />
                      )}
                    </div>
                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Город
                      </span>
                      <CitySelect style={"w-full h-12"} />
                    </div>
                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <>
                        <span className="hidden md:block text-grey text-sm">
                          Район
                        </span>
                        <AreasDropdown
                          buttonClassName={"h-12 w-full"}
                          setAreaIds={setAreaIds}
                          areaIds={areaIds}
                          returnActiveAreas={areasCallback}
                        />
                      </>
                    </div>
                  </>
                ) : (
                  <>
                    {showMore && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            type: "Inertia",
                          },
                        }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-2"
                      >
                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <span className="hidden md:block text-grey text-sm">
                            Площадь, м²
                          </span>
                          {isSquaresLoading ? (
                            <Preloader />
                          ) : (
                            <RangeSlider
                              callback={squaresCallback}
                              key={
                                squaresMax && squaresMax.living_squares
                                  ? squaresMax.living_squares
                                  : squaresMax && squaresMax.land_squares
                              }
                              min={0}
                              max={
                                squaresMax && squaresMax.living_squares
                                  ? squaresMax.living_squares
                                  : squaresMax && squaresMax.land_squares
                              }
                              valueMin={
                                filterGlobalFields.living_squares
                                  ? filterGlobalFields.living_squares.from
                                  : ""
                              }
                              valueMax={
                                filterGlobalFields.living_squares
                                  ? filterGlobalFields.living_squares.to
                                  : ""
                              }
                              name="Площадь, м²"
                            />
                          )}
                        </div>
                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <span className="hidden md:block text-grey text-sm">
                            Цена, руб
                          </span>
                          {isPriceLoading ? (
                            <Preloader />
                          ) : (
                            <RangeSlider
                              callback={priceCallback}
                              key={priceMax && priceMax.product_price}
                              min={0}
                              max={priceMax && priceMax.product_price}
                              valueMin={
                                filterGlobalFields.product_price
                                  ? filterGlobalFields.product_price.from
                                  : ""
                              }
                              valueMax={
                                filterGlobalFields.product_price
                                  ? filterGlobalFields.product_price.to
                                  : ""
                              }
                              name="Цена, руб"
                            />
                          )}
                        </div>
                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <span className="hidden md:block text-grey text-sm">
                            Ипотека
                          </span>
                          <SelectNoAutocomplete
                            style={"w-full h-12"}
                            name={"ismortgage"}
                            options={mortgage}
                            callback={mortgageCallback}
                          />
                        </div>
                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <span className="hidden md:block text-grey text-sm">
                            Город
                          </span>
                          <CitySelect style={"w-full h-12"} />
                        </div>
                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <>
                            <span className="hidden md:block text-grey text-sm">
                              Район
                            </span>
                            <AreasDropdown
                              buttonClassName={"h-12 w-full"}
                              setAreaIds={setAreaIds}
                              areaIds={areaIds}
                            />
                          </>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {isSidebar && (
                  <div
                    className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                  >
                    <span className="hidden md:block text-grey text-sm">
                      Ремонт
                    </span>
                    {repairment && (
                      <SelectNoAutocomplete
                        style={"w-full h-12"}
                        name={"repairment"}
                        options={repairment}
                        callback={repairmentCallback}
                      />
                    )}
                  </div>
                )}

                {!MOBILE && (
                  <div
                    href="#categoryOutput"
                    className={`md:w-[32%] lg:w-[24%] flex items-end cursor-pointer hover:underline ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                    onClick={() => runFilterCallback()}
                  >
                    <div
                      className="h-12 w-full"
                      onClick={() => runFilterCallback()}
                    >
                      <Button>
                        <div className="flex flex-col items-center">Найти</div>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {MOBILE && (
                <>
                  <div className="flex gap-2">
                    <CitySelect style={"w-full h-12"} />
                    <AreasDropdown
                      buttonClassName={"h-12 w-full"}
                      setAreaIds={setAreaIds}
                      areaIds={areaIds}
                    />
                  </div>
                </>
              )}
            </div>
            {MOBILE && (
              <div
                className="h-12"
                onClick={() => {
                  setSearchResult(
                    `Найдено ${productsSum} ${declension(productsSum, [
                      "объявление",
                      "объявления",
                      "объявлений",
                    ])}`
                  );
                }}
              >
                <Button>
                  <div
                    onClick={() => runFilterCallback()}
                    href="#categoryOutput"
                    className="flex flex-col items-center"
                  >
                    Найти
                    <span className="text-xs">
                      Найдено {productsSum}{" "}
                      {declension(productsSum, [
                        "объявление",
                        "объявления",
                        "объявлений",
                      ])}
                    </span>
                  </div>
                </Button>
              </div>
            )}
            <div className="flex justify-between pt-2">
              {MOBILE && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowMore((showMore) => !showMore);
                  }}
                >
                  <span className="text-sm">Больше параметров</span>
                </div>
              )}
              <div
                className={`md:flex md:items-center md:w-full ${
                  isSidebar ? "md:justify-center" : "md:justify-between"
                }`}
              >
                {!MOBILE && !isSidebar && (
                  <a
                    href="#categoryOutput"
                    className="text-sm text-blue hover:text-primary"
                  >
                    Найдено {productsSum}{" "}
                    {declension(productsSum, [
                      "объявление",
                      "объявления",
                      "объявлений",
                    ])}
                  </a>
                )}
                <div
                  className="flex items-center cursor-pointer md:justify-between"
                  onClick={cleanFilter}
                >
                  <span className="text-sm">Очистить фильтр</span>
                  <div className="ml-2.5">
                    <Image src={closeIcon.src} width={7} height={7} />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
