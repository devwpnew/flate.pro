import API from "pages/api/service/api";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import H2 from "@modules/common/components/heading/h2";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import SelectNoAutocompleteWithLevels from "@modules/common/components/select/listBox/selectNoAutocompleteWithLevels";
import Input from "@modules/common/components/input/input";
import Button from "@modules/common/components/button/button";
import SelectRelatedInAdd from "@modules/common/components/select/selectRelatedInAdd";
import RadioAddProduct from "@modules/common/components/radio/radioAddProduct";
import Textarea from "@modules/common/components/textarea/textarea";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import galleryIcon from "public/icons/gallery-icon.svg";
import { useRouter } from "next/router";
import { phoneMask } from "lib/tools/mask";
import { Dialog } from "@headlessui/react";
import SelectMulti from "@modules/common/components/select/comboBox/selectAutocompleteMultiselect";
import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import MaskInput from "react-maskinput/lib";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ReactSortable } from "react-sortablejs";
import { useSelector } from "react-redux";
import LocationButton from "@modules/location/components/button/button";
import locationPrimaryIcon from "public/icons/map-mark-primary.svg";
import arrowPrimaryIcon from "public/icons/arrow-primary.svg";

export default function AddForm({ user, product, sidebarCallback }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFalse, setIsOpenFalse] = useState(false);

  const [citySelected, setCitySelected] = useState(false);

  const [fieldsArray, setFieldsArray] = useState(null);
  const [previewGalery, setGallery] = useState(null);
  const [galleryInput, setGalleryInput] = useState(null);
  const [comission, setComission] = useState("Включена");

  const [fields, setFields] = useState({});
  const [sectionsList, setSections] = useState(false);
  const [areasList, setAreas] = useState(false);
  const [addressValue, setAddressValue] = useState(
    product && product.properties && product.properties.product_address
  );
  const [parkingType, setParkingType] = useState(false);
  const [currentSection, setCurrentSection] = useState(false);
  const [rcQuery, setRcQuery] = useState(false);
  const [rcInfo, setRCInfo] = useState(product && product.rc_link);
  const [rcList, serRcList] = useState(false);
  const [rcQueryError, setRcQueryError] = useState(false);
  const formRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (isOpen == true) {
      setTimeout(() => {
        setIsOpen(false);
        router.push({ pathname: "/user/profile/items" });
      }, 2500);
    }

    if (isOpenFalse == true) {
      setTimeout(() => {
        setIsOpenFalse(false);
      }, 2500);
    }
  }, [isOpen, isOpenFalse]);

  useEffect(() => {
    (() => {
      setIsLoading(true);

      (async function fetchColumns() {
        const getFieldsArray = await axios.post(
          window.location.origin + "/api/admin_api/getCreateFields",
          {
            version: "userAdmin",
            table: "product",
          }
        );

        setFieldsArray(getFieldsArray.data);

        const sections = await API.get.sections({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
          filter: {
            active: true,
          },
        });

        setSections(sections);

        // const areas = await API.get.areasList(activeCity.id)
        // setAreas(areas)

        if (product) {
          if (product.comission) {
            changeFields(false, "comission", product.comission);
            setComission(product.comission);
          }
          if (
            product.properties &&
            typeof product.properties.product_galery == "string"
          ) {
            product.properties.product_galery =
              JSON.parse(product.properties.product_galery);
          }
        }

        // const getRcList = await API.get.rcs({ filter: { published: "1", city_link: activeCity.id } });
        // serRcList(getRcList);

        // if(product && product.properties && product.properties.product_galery && !galleryInput){
        //   const prodGal = product.properties.product_galery;
        //   const inputValueFromGallery = await Promise.all(prodGal.map(async (imageUrl, index) => {
        //     const newName = `gal-${index}`
        //     const file = new File([await API.get.imageInfo(imageUrl, newName)], newName)
        //     if(file){
        //       file.id = index
        //       return file
        //     }
        //   }))
        //   setGalleryInput(inputValueFromGallery)
        // }
      })();

      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      let filesResult =
        previewGalery && previewGalery.length ? previewGalery : [];
        
      if (galleryInput) {
        for (let i in galleryInput) {
          const file = galleryInput[i];
          if (typeof file == "object") {
            file.id =
              previewGalery && previewGalery.length
                ? parseInt(previewGalery.length) + parseInt(i) + 1
                : parseInt(i);
            filesResult.push(file);
          }
        }
        setGalleryInput(null);
      }

      setGallery(Array.from(filesResult));

      if (typeof sidebarCallback != "undefined") {
        sidebarCallback(fields, filesResult);
      }
      setIsLoading(false);
    })();
  }, [galleryInput]);

  useEffect(() => {
    (async () => {

      const areas = await API.get.areasList(citySelected)
      setAreas(areas)

      const getRcList = await API.get.rcs({ filter: { published: "1", city_link: citySelected } });
      serRcList(getRcList);

    })()
  }, [citySelected])

  useEffect(() => {
    return () => {
      changeFields(false, "property_product_address", addressValue);
    };
  }, [addressValue]);

  const changeFields = (event, forceName = false, forceValue = false) => {
    setIsLoading(true);
    let currentFields = fields;

    if (forceName && forceValue) {
      currentFields[forceName] = forceValue;
    } else if (typeof event == "function") {
      const callbackEvent = event();
      if (callbackEvent) {
        if (callbackEvent.name && callbackEvent.value != null) {
          currentFields[callbackEvent.name] = callbackEvent.value;
        }
      }
    } else if (event) {
      if (event.target) {
        if (event.target.files) {
          currentFields[event.target.name] = event.target.files;
        } else if (typeof event.target.value != "undefined") {
          currentFields[event.target.name] = event.target.value;
        }
      }
    }

    if (currentFields.section_relation) {
      setCurrentSection(currentFields.section_relation);
    }

    if (
      currentFields.section_relation == 3 ||
      currentFields.section_relation == 4 ||
      currentFields.section_relation == 5
    ) {
      if (currentFields.name) {
        delete currentFields.name;
      }
    }

    if (currentFields.section_relation == 7) {
      if (typeof currentFields.parking_types != "undefined") {
        setParkingType(currentFields.parking_types);
      }
    } else {
      delete currentFields.parking_types;
    }

    if (
      currentFields.section_relation != 4 &&
      currentFields.section_relation != 5
    ) {
      if (currentFields.land_squares) {
        delete currentFields.land_squares;
      }
    }

    if (
      typeof currentFields.rc_link != "undefined" &&
      currentFields.rc_link > 0
    ) {
      updateRCInfo(currentFields.rc_link);
    } else if(product && product.rc_link && product.rc_link.id){ // Сделал так чтобы в формдату не летел кал
      currentFields.rc_link = product && product.rc_link && product.rc_link.id;
    }

    if(currentFields['city_link']){
      setCitySelected(currentFields['city_link'])
    }

    setFields(currentFields);
    if (typeof sidebarCallback != "undefined") {
      sidebarCallback(fields, previewGalery);
    }

    setIsLoading(false);
  };

  const updateRCInfo = async (rc_id) => {
    const getRcInfo = await API.get.rcs({ filter: { id: rc_id }, limit: 1 });
    if (
      typeof getRcInfo != "undefined" &&
      typeof getRcInfo.error == "undefined"
    ) {
      if (
        (rcInfo && rcInfo.address != getRcInfo.address) ||
        (getRcInfo.address && addressValue != getRcInfo.address)
      ) {
        setAddressValue(getRcInfo.address ? getRcInfo.address : "");
      }

      setRCInfo(getRcInfo);
    }
  };

  const sendForm = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    let formData = new FormData(formRef.current);


    for (var key in fields) {
      if (formData.get(key)) {
        formData.set(key, fields[key]);
      } else {
        formData.append(key, fields[key]);
      }
    }
    if (addressValue) {
      formData.set("property_product_address", addressValue);
    }

    const action = formRef.current.getAttribute("name");

    if (previewGalery) {
      for (let i in previewGalery) {
        formData.append("property_product_galery", previewGalery[i]);
      }
    }

    if (rcQuery != "" && !fields["rc_link"]) {
      // Что-то введено в поле, но не выбран жк
      setRcQueryError(true);
      errorRef.current.scrollIntoView({ block: "center" });
    } else {
      if (action == "editAd" && product && user) {
        formData.append("id", product.id);
        const res = await API.update.product(formData);
        // if (res.data.itemId) {
        //   setIsOpen(true);
        // } else {
        //   setIsOpenFalse(true);
        // }
      } else if (action == "addAd") {
        formData.append("user_id", user.id);
        const res = await API.add.product(formData);
        if (res && res.itemId) {
          setIsOpen(true);
        } else {
          setIsOpenFalse(true);
        }
      }
    }
    setIsLoading(false);
  };

  const newRcChoose = async (data) => {
    let getRcInfo = false;
    if (data && data.itemId) {
      getRcInfo = await API.get.rcs({ filter: { id: data.itemId }, limit: 1 });
    } else {
      getRcInfo = await API.get.rcs({ filter: { id: data.value }, limit: 1 });
    }
    if (getRcInfo) {
      changeFields(false, "rc_link", getRcInfo.id);
    }
  };

  const changeComission = (event) => {
    setIsLoading(true);

    changeFields(false, event.target.name, event.target.value);
    setComission(event.target.value);

    setIsLoading(false);
  };

  const removeGalleryItem = async (imageId) => {
    const filesResult = [];
    for (let i in previewGalery) {
      const file = previewGalery[i];
      if (typeof file == "object" && file.id != imageId) {
        filesResult.push(file);
      }
    }

    setGallery(filesResult);
  };

  const getOptions = (fieldCode) => {
    if (fieldsArray) {
      if (fieldsArray.columns && fieldsArray.columns[fieldCode]) {
        return fieldsArray.columns[fieldCode].resultOptions;
      }
    }
  };

  const intInputChange = (input) => {
    input.target.value = input.target.value.replace(/[^0-9]/g, "");
    input.target.value = parseInt(input.target.value);

    if (isNaN(input.target.value)) {
      input.target.value = "";
      return;
    }
  };

  const toggleBorderRed = (val) => {
    if (val.target.value.length > 0) {
      val.target.parentElement.classList.remove("border-red");
    } else {
      val.target.parentElement.classList.add("border-red");
    }
  };

  return (
    <>
      <form
        onSubmit={sendForm}
        encType="multipart/form-data"
        ref={formRef}
        name={product ? "editAd" : "addAd"}
        className="w-full"
      >
        <div className="block w-full">
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="md:max-w-[230px] lg:max-w-[300px]">
              <div className="mb-7">
                <H2>Категория</H2>
              </div>
              <div className="font-bold mb-2.5 text-sm">Тип</div>
              <div className="mb-5">
                <SelectNoAutocompleteWithLevels
                  style={"w-full h-11 border-greyborder border"}
                  name={"section_relation"}
                  addCallback={changeFields}
                  defaultOption={product && product.section_relation[0]}
                  options={sectionsList && sectionsList}
                />
              </div>
              {currentSection &&
                currentSection != 3 &&
                currentSection != 4 &&
                currentSection != 5 && ( // Не квартиры, не дома и не земля
                  <>
                    <div className="font-bold mb-2.5 text-sm">
                      Название <span className="text-red">*</span>
                    </div>
                    <div className="mb-5">
                      <Input
                        name={"name"}
                        value={product && product.name}
                        required={true}
                        minLength={3}
                        labelStyle={"w-full h-11 border-red"}
                        placeholder={"Название объявления"}
                        onChange={(val) => {
                          changeFields(val);
                          toggleBorderRed(val);
                        }}
                      />
                    </div>
                  </>
                )}
            </div>
            {currentSection &&
              currentSection == 3 && ( // Квартиры
                <div className="md:max-w-[230px] lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">Статус</div>
                  <div className="mb-5">
                    <SelectNoAutocomplete
                      style={"w-full h-11 border-greyborder border"}
                      name={"status"}
                      type={"Статус"}
                      defaultOption={
                        product && getOptions("status")[product.status]
                      }
                      addCallback={changeFields}
                      options={getOptions("status")}
                    />
                  </div>
                </div>
              )}
            {currentSection &&
              currentSection == 4 && ( // Дома
                <div className="md:max-w-[230px] lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">Вид</div>
                  <div className="mb-5">
                    <SelectNoAutocomplete
                      style={"w-full h-11 border-greyborder border"}
                      name={"house_types"}
                      type={"Статус"}
                      defaultOption={
                        product &&
                        getOptions("house_types")[product.house_types]
                      }
                      addCallback={changeFields}
                      options={getOptions("house_types")}
                    />
                  </div>
                </div>
              )}
            {currentSection &&
              currentSection == 5 && ( // Земля
                <div className="md:max-w-[230px] lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">Статус</div>
                  <div className="mb-5">
                    <SelectNoAutocomplete
                      style={"w-full h-11 border-greyborder border"}
                      name={"status_lands"}
                      type={"Статус"}
                      defaultOption={
                        product &&
                        getOptions("status_lands")[product.status_lands]
                      }
                      addCallback={changeFields}
                      options={getOptions("status_lands")}
                    />
                  </div>
                </div>
              )}
            {currentSection &&
              currentSection == 6 && ( // Коммерция
                <div className="md:max-w-[230px] lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">Вид объекта</div>
                  <div className="mb-5">
                    <SelectNoAutocomplete
                      style={"w-full h-11 border-greyborder border"}
                      name={"commercial_types"}
                      defaultOption={
                        product &&
                        getOptions("commercial_types")[product.commercial_types]
                      }
                      addCallback={changeFields}
                      options={getOptions("commercial_types")}
                    />
                  </div>
                </div>
              )}
            {currentSection &&
              currentSection == 7 && ( // Машиноместа
                <div className="md:max-w-[230px] lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">Вид объекта</div>
                  <div className="mb-5">
                    <SelectNoAutocomplete
                      style={"w-full h-11 border-greyborder border"}
                      name={"parking_types"}
                      defaultOption={
                        product &&
                        getOptions("parking_types")[product.parking_types]
                      }
                      addCallback={changeFields}
                      options={getOptions("parking_types")}
                    />
                  </div>
                </div>
              )}
            {(user && user.user_group && user.user_group == 5) ||
            user.user_group?.id == 5 ? (
              <>
                <div className="md:max-w-[230px] lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">
                    Премиум объявление
                  </div>
                  <div className="mb-5">
                    <SelectNoAutocomplete
                      style={"w-full h-11 border-greyborder border"}
                      name={"premium"}
                      type={"Премиум объявление"}
                      defaultOption={
                        product && product.premium && fieldsArray
                          ? getOptions("premium")[product.premium]
                          : fieldsArray && getOptions("premium")[0]
                      }
                      addCallback={changeFields}
                      options={getOptions("premium")}
                    />
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="pt-3 pb-7 md:bocrder-b-[1px] md:border-greyborder w-full">
            <div className="mb-7">
              <H2>
                Адрес <span className="text-red">*</span>
              </H2>
            </div>
            <div className="md:flex md:items-center md:gap-2 mb-5">
              <div className="md:w-full lg:max-w-[300px]">
                <div className="font-bold mb-2.5 text-sm">
                  Город
                </div>
                <div className="mb-5">
                  <SelectNoAutocomplete
                    style={"w-full h-11 border-greyborder border"}
                    name={"city_link"}
                    defaultOption={
                      product && product.city_link && fieldsArray
                        ? getOptions("city_link")[product.city_link]
                        : fieldsArray && getOptions("city_link")[0]
                    }
                    addCallback={changeFields}
                    options={getOptions("city_link")}
                  />
                </div>
              </div>
              {areasList && areasList.length > 0 ? <>
                <div className="md:w-full lg:max-w-[300px]">
                  <div className="font-bold mb-2.5 text-sm">Район</div>
                  <div className="mb-5">
                    <SelectNoAutocompleteWithLevels
                      style={"w-full h-11 border-greyborder border"}
                      name={"area_link"}
                      addCallback={changeFields}
                      defaultOption={product && product.area_link
                          ? getOptions("area_link")[product.area_link]
                          : areasList ? areasList[0] : null }
                      options={ areasList }
                    />
                  </div>
                </div>
              </> : '' }
            </div>
            {currentSection &&
              currentSection == 3 && ( // Квартиры
                <div className="mb-2.5 text-sm">
                  {rcInfo ? `Выбран: ${rcInfo.name}` : "Укажите адрес"}
                </div>
            )}
            <div className="md:flex md:items-center md:gap-2 mb-5">
              {currentSection &&
                currentSection == 3 && rcList && rcList.length ? ( // Квартиры
                  <>
                    <div className="mb-5 md:mb-0 md:w-full">
                      <SelectRelatedInAdd
                        style={"w-full h-11 border-greyborder border"}
                        name={"rc_link"}
                        field="name"
                        defaultInputValue={
                          product && product.rc_link && product.rc_link.name
                        }
                        rcAddedCallback={newRcChoose}
                        addCallback={newRcChoose}
                        inputOnChangeCallback={(val) => {
                          setRcQuery(val);
                          setRcQueryError(false);
                        }}
                        options={rcList}
                        placeholder={"Выберите ЖК или оставьте поле пустым"}
                      />
                      {rcQueryError && (
                        <>
                          <div ref={errorRef} className="text-red w-full">
                            Выберите ЖК или оставьте поле пустым
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : "" }
              <div className="md:w-full">
                <Input
                  style={"w-full h-11 border-greyborder border "}
                  name={"property_product_address"}
                  labelStyle={addressValue ? "" : "border-red"}
                  required={true}
                  value={addressValue}
                  placeholder={"Укажите адрес*"}
                  onChange={(e) => {
                    setAddressValue(e.target.value);
                    // toggleBorderRed(e);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="md:max-w-[465px] lg:max-w-[300px]">
              <div className="mb-7">
                <H2>Контакты</H2>
              </div>
              <div className="font-bold mb-2.5 text-sm">
                Размещает объявление:
              </div>
              <RadioAddProduct
                containerClassName="flex gap-2.5 mb-5"
                itemClassName="h-9 mb-1.5"
                name="product_placer"
                defaultValue={
                  product && product.product_placer && fieldsArray
                    ? getOptions("product_placer")[product.product_placer]
                    : fieldsArray && getOptions("product_placer")[1]
                }
                options={getOptions("product_placer")}
                addCallback={changeFields}
              />
              <div className="mb-5">
                <div className="font-bold mb-2.5 text-sm">Номер телефона:</div>
                <MaskInput
                  // alwaysShowMask
                  placeholder="+7 (000) 000-00-00"
                  maskChar="_"
                  name="property_product_phone"
                  className={
                    "w-full h-11 outline-none px-2.5 border-greyborder border text-sm rounded bg-white py-2"
                  }
                  mask={"+7 (000) 000 - 00-00"}
                  defaultValue={
                    product &&
                    product.properties &&
                    product.properties.product_phone
                      ? product.properties.product_phone
                      : user && user.phone
                  }
                  onChange={(e) => {
                    changeFields(e);
                  }}
                />
                {/* <Input
                  style={"w-full h-11"}
                  name={"product_phone"}
                  placeholder={"+7 (912) 345-67-89"}
                  defaultValue={
                    user && user.phone != false && phoneMask(user.phone)
                  }
                  value={product && product.properties.product_phone}
                  onChange={(e) => {
                    e.target.value = phoneMask(e.target.value);
                    changeFields(e);
                  }}
                /> */}
              </div>
            </div>
          </div>
          {/* <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="md:max-w-[425px] lg:max-w-[300px]">
              <div className="mb-7">
                <H2>Способ связи</H2>
                <RadioAddProduct
                  containerClassName="flex gap-5"
                  itemClassName="h-9 mb-1.5"
                  name="messages_calls"
                  defaultValue={
                    product &&
                    fieldsArray &&
                    getOptions("messages_calls")[product.messages_calls]
                  }
                  options={getOptions("messages_calls")}
                  addCallback={changeFields}
                />
              </div>
            </div>
          </div> */}
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            {/* <div className="md:max-w-[520px] lg:max-w-[300px]"> */}
            <div className="mb-7">
              <div className="md:max-w-[520px] lg:max-w-[320px]">
                <H2>
                  Об объекте <span className="text-red">*</span>
                </H2>
                <div className="flex gap-5">
                  {currentSection &&
                    currentSection == 3 && ( // Квартиры
                      <>
                        <div className="md:w-full">
                          <div className="mb-2.5 text-sm font-bold">Этаж</div>
                          <div className="mb-5">
                            <Input
                              type="number"
                              required={true}
                              labelStyle={"w-full h-11 border border-red"}
                              name={"property_product_floor"}
                              placeholder={"Этаж (если знаете)"}
                              value={
                                product && product.properties.product_floor
                              }
                              onChange={(val) => {
                                changeFields(val);
                                intInputChange(val);
                                toggleBorderRed(val);
                              }}
                            />
                          </div>
                        </div>
                        <div className="md:w-full">
                          <div className="mb-2.5 text-sm font-bold">
                            Этажей в доме
                          </div>
                          <div className="mb-5">
                            <Input
                              type="number"
                              required={true}
                              labelStyle={"w-full h-11 border border-red"}
                              name={"flat_floors"}
                              value={product && product.flat_floors}
                              placeholder={"Этажей в доме (если знаете)"}
                              onChange={(val) => {
                                changeFields(val);
                                intInputChange(val);

                                toggleBorderRed(val);
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  {currentSection &&
                    currentSection == 4 && ( // Дома
                      <>
                        <div className="mb-2.5 text-sm font-bold">
                          Этажей в доме
                        </div>
                        <RadioAddProduct
                          containerClassName="flex gap-5"
                          itemClassName="h-9 mb-1.5"
                          name="house_floors"
                          defaultValue={
                            product &&
                            getOptions("house_floors")[product.house_floors]
                          }
                          options={getOptions("house_floors")}
                          addCallback={changeFields}
                        />
                      </>
                    )}
                </div>
              </div>
              {currentSection &&
                currentSection == 3 && ( // Квартиры
                  <>
                    <div className="font-bold text-sm my-2.5">
                      Количество комнат*
                    </div>
                    <RadioAddProduct
                      containerClassName="flex gap-[10px]"
                      itemClassName="h-9 mb-1.5"
                      name="product_room_count"
                      defaultValue={
                        product &&
                        getOptions("product_room_count")[
                          product.product_room_count
                        ]
                      }
                      options={getOptions("product_room_count")}
                      addCallback={changeFields}
                    />
                  </>
                )}
              <div className="md:max-w-[520px] lg:max-w-[300px]">
                <div className="flex gap-5">
                  {currentSection &&
                    (currentSection == 3 || currentSection == 4) && ( // Квартиры или дома
                      <div className="md:w-full">
                        <div className="font-bold text-sm my-2.5">
                          Площадь{" "}
                          {currentSection == 4 && " дома" /* Для домов */}
                        </div>
                        <div className="mb-5">
                          <Input
                            name={"living_squares"}
                            placeholder={"м2"}
                            type={"number"}
                            step={0.1}
                            required={true}
                            labelStyle={"w-[120px] h-11 border border-red"}
                            value={product && product.living_squares}
                            onChange={(val) => {
                              changeFields(val);
                              // floatInputChange(val);

                              toggleBorderRed(val);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  {currentSection &&
                    (currentSection == 4 || currentSection == 5) && ( // Дома или земля
                      <div className="md:w-full">
                        <div className="font-bold text-sm my-2.5">
                          Площадь{" "}
                          {currentSection == 4 && " участка" /* Для домов */}
                        </div>
                        <div className="mb-5">
                          <Input
                            name={"land_squares"}
                            type={"number"}
                            step={0.1}
                            required={true}
                            labelStyle={"w-[120px] h-11 border border-red"}
                            value={product && product.land_squares}
                            placeholder={"га"}
                            onChange={(val) => {
                              changeFields(val);
                              toggleBorderRed(val);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  {currentSection &&
                    (currentSection == 6 || currentSection == 7) && ( // Коммерция и паркинги
                      <div className="md:w-full">
                        <div className="font-bold text-sm my-2.5">Площадь</div>
                        <div className="mb-5">
                          <Input
                            name={"object_squares"}
                            type="number"
                            step={0.1}
                            required={
                              currentSection == 6 || (parkingType == 0 && true)
                            }
                            labelStyle={"w-[120px] h-11 border-red border"}
                            value={product && product.object_squares}
                            placeholder={"м2"}
                            onChange={(val) => {
                              changeFields(val);
                              toggleBorderRed(val);
                            }}
                          />
                        </div>
                      </div>
                    )}
                </div>
              </div>
              {currentSection &&
                currentSection == 3 && ( // Квартиры
                  <>
                    <div className="font-bold text-sm my-2.5">Вид из окон</div>
                    <div className="mb-5">
                      <Textarea
                        name="window_view"
                        onChange={changeFields}
                        value={product && product.window_view}
                        style={"border-greyborder border rounded"}
                        areaStyle={"rounded h-11"}
                        placeholder={"Опишите что видно из вашего окна"}
                      />
                    </div>
                    <div className="font-bold text-sm my-2.5">Ремонт</div>
                    <RadioAddProduct
                      containerClassName="flex gap-2.5"
                      itemClassName="h-9 mb-1.5"
                      name="repairment"
                      options={getOptions("repairment")}
                      defaultValue={
                        product && getOptions("repairment")[product.repairment]
                      }
                      addCallback={changeFields}
                    />
                    <div className="font-bold text-sm my-2.5">Дом сдан</div>
                    <RadioAddProduct
                      containerClassName="flex gap-5"
                      itemClassName="h-9 mb-1.5"
                      name="mortgage"
                      options={getOptions("handed_over")}
                      defaultValue={
                        product &&
                        product.handed_over &&
                        getOptions("handed_over")[product.handed_over]
                      }
                      addCallback={changeFields}
                    />
                  </>
                )}
              {currentSection &&
                currentSection == 4 && ( // Дома
                  <>
                    <div className="font-bold text-sm my-2.5">Конструкция</div>
                    <RadioAddProduct
                      containerClassName="flex gap-5"
                      itemClassName="h-9 mb-1.5"
                      name="house_construction"
                      options={getOptions("house_construction")}
                      defaultValue={
                        product &&
                        product.house_construction &&
                        getOptions("house_construction")[
                          product.house_construction
                        ]
                      }
                      addCallback={changeFields}
                    />
                  </>
                )}
              {currentSection &&
                (currentSection == 4 || currentSection == 5) && ( // Дома или земля
                  <>
                    <div className="font-bold text-sm my-2.5">Коммуникация</div>
                    <SelectMultiSelect
                      name="house_communication"
                      style="h-9 mb-1.5"
                      placeholder="Ничего"
                      options={getOptions("house_communication")}
                      defaultValue={
                        product && product.house_communication
                        // getOptions("house_communication")[product.house_communication]
                      }
                      addCallback={changeFields}
                    />
                    {/* <RadioAddProduct
                    containerClassName="flex gap-5"
                    itemClassName="h-9 mb-1.5"
                    name="house_communication"
                    options={getOptions("house_communication")}
                    defaultValue={ product && product.house_communication && getOptions("house_communication")[product.house_communication] }
                    addCallback={changeFields}
                  /> */}
                  </>
                )}
            </div>
            {/* </div> */}
          </div>
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="lg:max-w-[300px]">
              <div className="mb-7">
                <H2>
                  Фотографии
                  <span className="text-red">*</span>
                </H2>
                <div className="mb-2.5 text-sm">
                  Сфотографируйте все комнаты, кухню, санузел, коридор, вид из
                  окна, фасад здания, подъезд. Максимум 30 фото. Если у вас нет
                  фотографий квартиры, прикрепите фотографию дома
                </div>
                <div className="h-11 mb-1.5">
                  <label className="flex justify-center text-sm text-white w-full h-full rounded md:text-black font-normal bg-blue  hover:underline underline-offset-2">
                    <div className="px-[13px] flex items-center justify-center gap-2.5">
                      <div>
                        <Image
                          src={galleryIcon.src}
                          width={galleryIcon.width}
                          height={galleryIcon.height}
                        />
                      </div>
                      <div>Добавить фото</div>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => {
                        setGalleryInput(e.target.files);
                      }}
                      multiple={true}
                      // name="property_product_galery"
                      accept="image/*"
                      className="hidden"
                    />
                    {/* <input
                      type="file"
                      onChange={changeGallery}
                      multiple={true}
                      name="property_product_galery"
                      accept="image/*"
                      // className="hidden"
                    /> */}
                  </label>
                </div>
              </div>
            </div>
            <div className="lg:max-w-[300px]">
              <div className="mb-7">
                <div className="font-bold text-sm my-2.5">Презентация</div>
                <input
                  type="file"
                  // onChange={changeFields}
                  name="presentation"
                  accept="application/pdf"
                  // className="hidden"
                />
              </div>
            </div>
            {previewGalery && previewGalery.length > 0 && (
              <>
                <ReactSortable
                  className="flex flex-wrap items-start gap-2.5"
                  list={previewGalery}
                  setList={setGallery}
                >
                  {previewGalery.map((image) => {
                    return (
                      <>
                        <div
                          key={image.id}
                          className="relative w-[200px] h-[200px] flex justify-center items-center"
                        >
                          <span
                            className="absolute flex justify-center items-center right-[5px] top-[5px] w-[20px] h-[20px] cursor-pointer bg-greyF3 rounded-full"
                            onClick={(e) => {
                              removeGalleryItem(image.id);
                            }}
                          >
                            {printCross}
                          </span>
                          <img
                            className="max-w-[200px] max-h-[200px]"
                            src={URL.createObjectURL(image)}
                          />
                        </div>
                      </>
                    );
                  })}
                </ReactSortable>
              </>
            )}
          </div>
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="lg:max-w-[300px]">
              <div className="mb-7">
                <H2>Видео</H2>
                <div className="mb-5">
                  <Input
                    style={"w-full h-11 border-greyborder border"}
                    name={"youtube_video_link"}
                    value={product && product.youtube_video_link}
                    placeholder={"Ссылка на YouTube"}
                    onChange={changeFields}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="mb-7">
              <H2>
                Описание <span className="text-red">*</span>
              </H2>
              <div className="mb-5">
                <Textarea
                  required={true}
                  name="product_description"
                  style={"h-[170px] border-red border rounded"}
                  areaStyle={"rounded"}
                  onChange={(val) => {
                    changeFields(val);
                    toggleBorderRed(val);
                  }}
                  value={product && product.product_description}
                  placeholder="Расскажите, что есть в квартире и рядом с домом, в каком состоянии жильё. Покупателям интересно, сколько идти до магазинов и остановок транспорта, есть ли рядом торговые центры, парки и другая инфраструктура"
                />
              </div>
            </div>
          </div>
          <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
            <div className="lg:max-w-[300px]">
              <div className="mb-7">
                <H2>Условия сделки</H2>
                <div className="mb-5">
                  <div className="mb-2.5 text-sm font-bold">
                    Цена
                    <span className="text-red">*</span>
                  </div>
                  <Input
                    labelStyle={"w-full h-11 border-red border"}
                    required={true}
                    name={"product_price"}
                    defaultValue={product && product.product_price}
                    placeholder={"Цена"}
                    onChange={(val) => {
                      changeFields(val);
                      intInputChange(val);
                      toggleBorderRed(val);
                    }}
                  />
                </div>

                {currentSection &&
                  currentSection == 3 && ( // Квартиры
                    <div className="mb-5">
                      <div className="mb-2.5 text-sm font-bold">
                        Комиссия
                        <span className="text-red">*</span>
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="comission"
                          className="flex items-center mb-2.5 text-sm cursor-pointer"
                        >
                          <div className="mr-2">
                            <input
                              id="comission"
                              type="checkbox"
                              name="comission"
                              checked={comission == "Включена"}
                              value="Включена"
                              className="bg-white border-greymiddle border w-[12px] h-[12px] flex flex-row justify-center items-center cursor-pointer"
                              onChange={changeComission}
                            />
                          </div>
                          Включена
                        </label>
                        {comission == "Включена" && (
                          <Input
                            name={"comission_sum_terms"}
                            labelStyle={"w-full h-11 border-red border"}
                            required={true}
                            value={product && product.comission_sum_terms}
                            placeholder={"Сумма и условия"}
                            onChange={(val) => {
                              changeFields(val);
                              toggleBorderRed(val);
                            }}
                          />
                        )}
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="comission-not"
                          className="flex items-center mb-2.5 text-sm cursor-pointer"
                        >
                          <div className="mr-2">
                            <input
                              id="comission-not"
                              type="checkbox"
                              name="comission"
                              checked={comission == "Не включена"}
                              value="Не включена"
                              className="bg-white border-greymiddle border w-[12px] h-[12px] flex flex-row justify-center items-center cursor-pointer"
                              onChange={changeComission}
                            />
                            {/* <CheckboxCheck /> */}
                          </div>
                          Не включена
                        </label>
                        {comission == "Не включена" && (
                          <RadioAddProduct
                            containerClassName="flex gap-5"
                            itemClassName="h-9 mb-1.5"
                            name="off_comission_value"
                            options={getOptions("off_comission_value")}
                            defaultValue={
                              product &&
                              getOptions("off_comission_value")[
                                product.off_comission_value
                              ]
                            }
                            addCallback={changeFields}
                          />
                        )}
                      </div>
                    </div>
                  )}

                {currentSection &&
                  currentSection != 6 &&
                  currentSection != 7 && (
                    <>
                      <div className="mb-5">
                        <div className="mb-2.5 text-sm font-bold">
                          Сумма в договоре
                          <span className="text-red">*</span>
                        </div>
                        <RadioAddProduct
                          containerClassName="flex gap-5"
                          itemClassName="h-9 mb-1.5"
                          name="sum_contract"
                          options={getOptions("sum_contract")}
                          defaultValue={
                            product &&
                            product.sum_contract &&
                            getOptions("sum_contract")[product.sum_contract]
                          }
                          addCallback={changeFields}
                        />
                      </div>
                      <div className="mb-5">
                        <div className="mb-2.5 text-sm font-bold">
                          Ипотека
                          <span className="text-red">*</span>
                        </div>
                        <RadioAddProduct
                          containerClassName="flex gap-5"
                          itemClassName="h-9 mb-1.5"
                          name="mortgage"
                          options={getOptions("mortgage")}
                          defaultValue={
                            product &&
                            product.mortgage &&
                            getOptions("mortgage")[product.mortgage]
                          }
                          addCallback={changeFields}
                        />
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className="h-9">
            <Button>Опубликовать</Button>
          </div>
        </div>
      </form>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-backdrop z-50" ariaHidden="true">
          <div className="h-screen flex justify-center items-center">
            <Dialog.Panel
              className={
                "mx-[16px] md:mx-auto bg-white p-5 rounded-[10px] relative max-w-[660px] w-full"
              }
            >
              <Dialog.Title
                className={"text-3xl font-extrabold text-center mb-5 block"}
              >
                Ваше объявление отправлено на проверку, оно появится в поиске
                через несколько минут
              </Dialog.Title>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-5 right-5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99946 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99946 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"
                    fill="#ABABAB"
                  />
                </svg>
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      
      <Dialog open={isOpenFalse} onClose={() => setIsOpenFalse(false)}>
        <div className="fixed inset-0 bg-backdrop z-50" ariaHidden="true">
          <div className="h-screen flex justify-center items-center">
            <Dialog.Panel
              className={
                "mx-[16px] md:mx-auto bg-white p-5 rounded-[10px] relative max-w-[660px] w-full"
              }
            >
              <Dialog.Title
                className={"text-3xl font-extrabold text-center mb-5 block"}
              >
                Произошла ошибка. Проверьте правильность ввода и повторите
                попытку
              </Dialog.Title>

              <button
                onClick={() => setIsOpenFalse(!isOpen)}
                className="absolute top-5 right-5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99946 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99946 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"
                    fill="#ABABAB"
                  />
                </svg>
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* MODAL LOADING */}
      <Dialog open={isLoading} onClose={() => setIsLoading(false)}>
        <div className="fixed inset-0 bg-backdrop z-50" ariaHidden="true">
          <div className="h-screen flex justify-center items-center">
            <Dialog.Panel
              className={
                "bg-white p-5 rounded-[10px] relative max-w-[435px] w-full"
              }
            >
              <>
                <Dialog.Title
                  className={"text-3xl font-extrabold text-center mb-5 block"}
                >
                  Загрузка...
                </Dialog.Title>
                <div className="flex flex-col justify-center items-center h-100">
                  <PreloaderSpinner />
                </div>
              </>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

const printCross = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99973 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99973 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"
      fill="#ABABAB"
    ></path>
  </svg>
);
