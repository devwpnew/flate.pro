import API from "pages/api/service/api";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@modules/common/components/container/container";
import Preloader from "@modules/common/components/preloader/preloader";
import Button from "@modules/common/components/button/button";
import RangeSlider from "@modules/common/components/range/range-slider";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import CitySelect from "@modules/location/components/button/select";
import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import SelectAutocompleteMultiselect from "@modules/common/components/select/comboBox/selectAutocompleteMultiselect";
import SectionSelect from "@modules/common/components/select/listBox/sectionSelect";
import SelectLinks from "@modules/common/components/select/listBox/selectLinks";

import closeIcon from "public/icons/close-blue.svg";

import declension from "helpers/formatters/declension";
import getLayout from "helpers/getLayout";
import randomInteger from "helpers/randomInteger";

import ModalArea from "@modules/common/components/dropdown/AreasDropdownContent";
import Input from "@modules/common/components/input/input";
import { useDispatch } from "react-redux";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";
export default function FilterHouses({
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

  landSquaresMaxCallback,
  livingSquaresMaxCallback,
  houseTypesCallback,
  houseConstructionCallback,
  houseCommunicationCallback,
  houseFloorsCallback,
  setFiterKeyCallback,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const slug = router.query.section_slug;
  const isLandPage = slug === "place" || parseInt(router.query.sections) === 5;

  const { MOBILE } = getLayout();

  const activeCity = useSelector((state) => state.userCity.value);

  const [showMore, setShowMore] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [res, setSearchResult] = useState(null);
  const [sections, setSections] = useState(null);
  const [areas, setAreas] = useState(null);

  const [isSquaresLoading, setSquaresLoading] = useState(true);
  const [landSquaresMin, setLandSquaresMin] = useState(null);
  const [landSquaresMax, setLandSquaresMax] = useState(null);
  const [livingSquaresMin, setLivingSquaresMin] = useState(null);
  const [livingSquaresMax, setLivingSquaresMax] = useState(null);
  const [houseTypes, setHouseTypes] = useState(null);
  const [houseConstruction, setHouseConstruction] = useState(null);
  const [houseCommunication, setHouseCommunication] = useState(null);
  const [houseFloors, setHouseFloors] = useState(null);

  const [isPriceLoading, setPriceLoading] = useState(true);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);

  const [mortgage, setMortgage] = useState(null);
  const [sumContract, setSumContract] = useState(null);

  const [repairment, setRepairment] = useState(null);

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
  // house_floors
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "house_floors");

      if (options) {
        const optionsNew = [];
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setHouseFloors(optionsNew);
      }
    })();
  }, []);
  // house_communication
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "house_communication");

      if (options) {
        const optionsNew = [];
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setHouseCommunication(optionsNew);
      }
    })();
  }, []);

  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "house_construction");

      if (options) {
        const optionsNew = [];
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setHouseConstruction(optionsNew);
      }
    })();
  }, []);
  // house_types
  useEffect(() => {
    (async function fetchFields() {
      const options = await API.get.fieldInfo("product", "house_types");

      if (options) {
        const optionsNew = [];
        options.descObj.result_options.map((el, index) => {
          optionsNew.push({ name: el, id: `${index}` });
        });

        setHouseTypes(optionsNew);
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

      setAreas(
        await API.get.areas({
          window_host: window.location.origin,
          select: ["id", "name"],
          filter: {
            link_city: activeCity.id,
          },
        })
      );

      setLoading(false);
    })();
  }, [activeCity]);

  // MIN MAX SQUARES
  useEffect(() => {
    (async function fetchSquares() {
      const selectPropsLand = ["id"];
      const selectPropsLiving = ["id"];

      const sortPropsLand = { asc: {}, desc: {} };
      const sortPropsLiving = { asc: {}, desc: {} };

      selectPropsLand.push("land_squares");
      sortPropsLand.desc["land_squares"] = "desc";
      sortPropsLand.asc["land_squares"] = "asc";

      selectPropsLiving.push("living_squares");
      sortPropsLiving.desc["living_squares"] = "desc";
      sortPropsLiving.asc["living_squares"] = "asc";

      setLandSquaresMin(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: selectPropsLand,
          sort: sortPropsLand.asc,
          limit: 1,
        })
      );

      setLandSquaresMax(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: selectPropsLand,
          sort: sortPropsLand.desc,
          limit: 1,
        })
      );

      setLivingSquaresMin(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: selectPropsLiving,
          sort: sortPropsLiving.asc,
          limit: 1,
        })
      );

      setLivingSquaresMax(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            active: true,
            published: "1",
            section_relation: sectionId,
          },
          select: selectPropsLiving,
          sort: sortPropsLiving.desc,
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



  const filterGlobalFields = useSelector(
    (state) => state.filterGlobalFields.value
  );

  const [areaIds, setAreaIds] = useState(null);
  const [areaModal, setAreaModal] = useState(false);
  const [activeAreas, setActiveAreas] = useState("");

  useEffect(() => {
    (function onAreasChange() {
      if (!areaIds || areaIds.length === 0) {
        setActiveAreas("");
        return;
      }

      const inputValue = [];

      if(areas) {
        areas.map((area) => {
          areaIds.map((areaId) => {
            if (area.id === areaId) {
              inputValue.push(area.name);
            }
          });
        });
      }

      setActiveAreas(inputValue.join(", "));
    })();
  }, [areaIds, areas]);

  useEffect(() => {
    if(filterGlobalFields && filterGlobalFields.area_link) {
      setAreaIds(filterGlobalFields.area_link)
    }
  })

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
                  <SelectLinks style={"w-full h-12"} options={sections} />
                </div>

                <div
                  className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                    isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                  }`}
                >
                  <span className="hidden md:block text-grey text-sm">
                    Вид объекта
                  </span>
                  {houseTypes && (
                    <SelectMultiSelect
                      options={houseTypes}
                      style={"h-12"}
                      callback={houseTypesCallback}
                      defaultValue={
                        filterGlobalFields.house_types
                          ? filterGlobalFields.house_types
                          : ""
                      }
                    />
                  )}
                </div>

                {!MOBILE ? (
                  <>
                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Площадь дома, м²
                      </span>
                      {isSquaresLoading ? (
                        <Preloader />
                      ) : (
                        <RangeSlider
                          callback={livingSquaresMaxCallback}
                          key={
                            livingSquaresMax && livingSquaresMax.living_squares
                          }
                          min={0}
                          max={
                            livingSquaresMax && livingSquaresMax.living_squares
                          }
                          name="Площадь дома, м²"
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
                        />
                      )}
                    </div>

                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Площадь участка, м²
                      </span>
                      {isSquaresLoading ? (
                        <Preloader />
                      ) : (
                        <RangeSlider
                          callback={landSquaresMaxCallback}
                          key={landSquaresMax && landSquaresMax.land_squares}
                          min={0}
                          max={landSquaresMax && landSquaresMax.land_squares}
                          name="Площадь участка, м²"
                          valueMin={
                            filterGlobalFields.land_squares
                              ? filterGlobalFields.land_squares.from
                              : ""
                          }
                          valueMax={
                            filterGlobalFields.land_squares
                              ? filterGlobalFields.land_squares.to
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
                        Этажей в доме
                      </span>
                      {houseFloors && (
                        <SelectMultiSelect
                          options={houseFloors}
                          style={"h-12"}
                          callback={houseFloorsCallback}
                        />
                      )}
                    </div>

                    <div
                      className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                        isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                      }`}
                    >
                      <span className="hidden md:block text-grey text-sm">
                        Конструкция
                      </span>
                      {houseConstruction && (
                        <SelectMultiSelect
                          options={houseConstruction}
                          style={"h-12"}
                          callback={houseConstructionCallback}
                          defaultValue={
                            filterGlobalFields.house_construction
                              ? filterGlobalFields.house_construction
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
                        Коммуникации
                      </span>
                      {houseCommunication && (
                        <SelectMultiSelect
                          options={houseCommunication}
                          style={"h-12"}
                          callback={houseCommunicationCallback}
                          defaultValue={
                            filterGlobalFields.house_communication
                              ? filterGlobalFields.house_communication
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
                        Сумма в договоре
                      </span>
                      {sumContract && (
                        <SelectNoAutocomplete
                          options={sumContract}
                          style={"h-12"}
                          callback={sumContractCallback}
                          defaultValue={
                            filterGlobalFields.sum_contranct
                              ? filterGlobalFields.sum_contranct
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
                        Ипотека
                      </span>
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
                          name="Цена, руб"
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
                        <div
                          className="relative w-full"
                          onClick={() => setAreaModal(true)}
                        >
                          <div className="flex px-2.5 border-greyborder hover:border-blue border rounded bg-white relative w-full overflow-hidden before:text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 cursor-pointer w-full h-12 hover:shadow-lg">
                            <Input
                              style="w-full border-none text-md leading-5 text-gray-900 focus:ring-0 outline-none cursor-pointer bg-white"
                              placeholder={"Любой"}
                              value={activeAreas}
                              inputStyle={"cursor-pointer bg-white"}
                              labelStyle={"bg-white"}
                              disabled
                            />
                          </div>
                        </div>

                        <ModalArea
                          state={areaModal}
                          onClose={() => setAreaModal(false)}
                          returnActiveAreasForInput={setAreaIds}
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
                            Площадь дома, м²
                          </span>
                          {isSquaresLoading ? (
                            <Preloader />
                          ) : (
                            <RangeSlider
                              callback={livingSquaresMaxCallback}
                              key={
                                livingSquaresMax &&
                                livingSquaresMax.living_squares
                              }
                              min={0}
                              max={
                                livingSquaresMax &&
                                livingSquaresMax.living_squares
                              }
                              name="Площадь дома, м²"
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
                            />
                          )}
                        </div>

                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <span className="hidden md:block text-grey text-sm">
                            Площадь участка, м²
                          </span>
                          {isSquaresLoading ? (
                            <Preloader />
                          ) : (
                            <RangeSlider
                              callback={landSquaresMaxCallback}
                              key={
                                landSquaresMax && landSquaresMax.land_squares
                              }
                              min={0}
                              max={
                                landSquaresMax && landSquaresMax.land_squares
                              }
                              name="Площадь участка, м²"
                              valueMin={
                                filterGlobalFields.land_squares
                                  ? filterGlobalFields.land_squares.from
                                  : ""
                              }
                              valueMax={
                                filterGlobalFields.land_squares
                                  ? filterGlobalFields.land_squares.to
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
                            Этажей в доме
                          </span>
                          {houseFloors && (
                            <SelectMultiSelect
                              options={houseFloors}
                              style={"h-12"}
                              callback={houseFloorsCallback}
                              defaultValue={
                                filterGlobalFields.house_floors
                                  ? filterGlobalFields.house_floors
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
                            Конструкция
                          </span>
                          {houseConstruction && (
                            <SelectMultiSelect
                              options={houseConstruction}
                              style={"h-12"}
                              callback={statusCallback}
                            />
                          )}
                        </div>

                        <div
                          className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
                            isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                          }`}
                        >
                          <span className="hidden md:block text-grey text-sm">
                            Коммуникации
                          </span>
                          {houseCommunication && (
                            <SelectMultiSelect
                              options={houseCommunication}
                              style={"h-12"}
                              callback={houseCommunicationCallback}
                            />
                          )}
                        </div>

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
                              defaultValue={
                                filterGlobalFields.sum_contranct
                                  ? filterGlobalFields.sum_contranct
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
                              name="Цена, руб"

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
                            <div
                              className="relative w-full"
                              onClick={() => setAreaModal(true)}
                            >
                              <div className="flex px-2.5 border-greyborder hover:border-blue border rounded bg-white relative w-full overflow-hidden before:text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 cursor-pointer w-full h-12 hover:shadow-lg">
                                <Input
                                  style="w-full border-none text-md leading-5 text-gray-900 focus:ring-0 outline-none cursor-pointer bg-white"
                                  placeholder={"Любой"}
                                  value={activeAreas}
                                  inputStyle={"cursor-pointer bg-white"}
                                  labelStyle={"bg-white"}
                                  disabled
                                />
                              </div>
                            </div>

                            <ModalArea
                              state={areaModal}
                              onClose={() => setAreaModal(false)}
                              returnActiveAreasForInput={setAreaIds}
                              returnActiveAreas={areasCallback}
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
                    href="categoryOutput"
                    className={`md:w-[32%] lg:w-[24%] flex items-end cursor-pointer hover:underline ${
                      isSidebar ? "md:w-[100%] lg:w-[100%]" : ""
                    }`}
                    onClick={() => runFilterCallback()}
                  >
                    <div
                      className="h-12 w-full mb-[6px]"
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
                    <SelectNoAutocomplete
                      style={"w-full md:w-[32%] lg:w-[24%] h-12"}
                      name={"areas"}
                      options={[
                        {
                          id: 0,
                          name: "Все",
                        },
                      ].concat(areas)}
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
