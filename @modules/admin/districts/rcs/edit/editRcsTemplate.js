import { Dialog } from "@headlessui/react";
import BackButton from "@modules/common/components/button/backButton";
import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import H1 from "@modules/common/components/heading/h1";
import Input from "@modules/common/components/input/input";
import MapSuggestedInput from "@modules/common/components/map/mapSuggestedInput";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Textarea from "@modules/common/components/textarea/textarea";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";
import FieldImages from "@modules/user/components/add/part/fields/fieldImages";
import { formateDate } from "helpers/formateDate";
import getLayout from "helpers/getLayout";
import { useRouter } from "next/router";
import api from "pages/api/service/api";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function EditRcsTemplate({ rcId }) {
  const router = useRouter();
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();
  const user = useSelector((state) => state.userLogin.value);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState({ name: "Сочи", id: 5 });
  const [selectedParentArea, setSelectedParentArea] = useState(null);
  const [selectedMicroArea, setSelectedMicroArea] = useState(null);

  const [microAreasList, setMicroAreasList] = useState(null);
  const [areasParentsList, setAreasParentsList] = useState(null);
  const [citiesList, setCitiesList] = useState(null);

  const [rc, setRc] = useState(null);
  const [publishedValues, setPublishedValues] = useState(null);

  const formRef = useRef(null);
  const [fields, setFields] = useState({});

  const [mapAddress, setMapAddress] = useState("");

  useEffect(() => {
    (async function fetchCities() {
      const getCitiesList = await api.get.cities({ sort: { id: "asc" } });
      setCitiesList(getCitiesList);
    })();
  }, []);

  useEffect(() => {
    (async function fetchAreas() {
      setIsLoading(true);
      const getAreasList = await api.get.areas({
        filter: { link_city: selectedCity.id, parent_area: "null" },
        limit: "all",
      });
      setAreasParentsList(getAreasList);

      setIsLoading(false);
    })();
  }, [selectedCity]);

  useEffect(() => {
    (async function fetchCities() {
      if (!selectedCity || !selectedParentArea) return;

      const getMicroAreasList = await api.get.areas({
        window_host: window.location.origin,
        filter: {
          city_link: selectedCity.id,
          parent_area: selectedParentArea.id,
        },
        sort: {
          id: "asc",
        },
        limit: "all",
      });

      setMicroAreasList(getMicroAreasList);
    })();
  }, [selectedParentArea, selectedCity]);

  useEffect(() => {
    (async function fetchRcs() {
      if (rcId != "add") {
        const getRc = await api.get.rcs({
          window_host: window.location.origin,
          filter: { id: rcId },
          limit: 1,
          limit: "all",
        });
        if (getRc) {
          setRc(getRc[0]);
        }
      }
      const getCitiesList = await api.get.cities({ sort: { id: "asc" } });
      setCitiesList(getCitiesList);
      const getPubInfo = await api.get.fieldInfo("rcs", "published");
      setPublishedValues(
        getPubInfo.descObj.result_options.map((value, index) => {
          return { id: index, name: value };
        })
      );
    })();
  }, [rcId]);

  const changeFields = (event, forceName = false, forceValue = false) => {
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
        } else if (event.target.value) {
          currentFields[event.target.name] = event.target.value;
        }
      }
    }

    setFields(currentFields);
  };

  const sendForm = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    for (const key in fields) {
      if (key === "images") {
        const galleryFiles = fields[key];
        const galleryFilesResult = [];

        if (
          galleryFiles &&
          galleryFiles.length > 0 &&
          galleryFiles[0].name !== ""
        ) {
          galleryFiles.map((file) => {
            galleryFilesResult.push(file);
          });

          formData.delete("images");

          galleryFilesResult.map((file) => {
            formData.append("images", file);
          });
        }
      }
    }

    if (selectedCity) {
      formData.set("city_link", selectedCity.id);
    }

    if (selectedParentArea?.id) {
      formData.set("area_link", selectedParentArea.id);
    }

    if (selectedMicroArea?.id) {
      formData.set("area_link", selectedMicroArea.id);
    }

    for (const key of formData) {
      // console.log(key);
    }

    const action = formRef.current.getAttribute("name");
    if (action == "editAd" && rc && user) {
      formData.append("id", rc.id);
      const res = await api.update.rcs(formData, true);
      // console.log(res);
      if (res) {
        alert("ЖК успешно изменён");
        router.push("//user/admin/rcs/");
      }
    } else if (action == "addAd") {
      const res = await api.add.rcs(formData, true);
      if (res) {
        alert("ЖК успешно добавлен");
        router.push("//user/admin/rcs/");
      }
    }
  };

  const deleteRcItem = async (e) => {
    e.preventDefault();
    const res = await api.remove.rcs(rcId);
    if (res) {
      if (res.Error) {
        alert(res.Error);
      } else {
        alert("ЖК успешно удален");
        router.push("//user/admin/rcs/");
      }
    }
  };

  const [defValueParent, setDefValueParent] = useState(null);
  const [defValue, setDefValue] = useState(null);

  useEffect(() => {
    if (rc) {
      const rcInfo = rc;

      if (rcInfo.area_link?.parent_area) {
        setDefValueParent(rcInfo.area_link?.parent_area);
      }

      if (rcInfo.area_link?.id) {
        setDefValue(rcInfo.area_link?.id);
      }
    }
  }, [rc]);

  // console.log(defValueParent, "defValueParent", defValue, "defValue");
  // console.log(rc);

  return (
    <>
      <div className="w-full">
        {rc || rcId == "add" ? (
          <Container>
            <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
              {rc ? <H1>Редактировать {rc.name}</H1> : <H1>Добавить ЖК</H1>}
            </div>
            <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
              <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder">
                <div className="flex flex-col gap-5 mb-[35px]">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Дата создания</span>
                    <span className="text-grey text-sm">
                      {rc?.date_created && formateDate(rc.date_created)}
                    </span>
                  </div>
                  {rc && rc.date_edited && (
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        Последний раз редактировалось
                      </span>
                      {rc.last_edited_by ? (
                        <Link
                          href={`/user/admin/users/${rc.last_edited_by.id}`}
                        >
                          <a
                            className="text-blue cursor-pointer hover:underline underline-offset-2"
                            href={`/user/admin/users/${rc.last_edited_by.id}`}
                          >
                            <div>ID: {`${rc.last_edited_by.id} `}</div>
                            <div>
                              {rc.last_edited_by.name
                                ? rc.last_edited_by.name
                                : rc.last_edited_by.phone}
                            </div>
                          </a>
                        </Link>
                      ) : (
                        ""
                      )}
                      <span className="text-grey text-sm">
                        {rc?.date_edited && formateDate(rc.date_edited)}
                      </span>
                    </div>
                  )}
                </div>
                {rc && (
                  <div className="flex flex-col gap-5">
                    <span
                      className="font-semibold text-sm cursor-pointer hover:underline"
                      onClick={deleteRcItem}
                    >
                      Удалить ЖК
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full px-5">
                <form
                  onSubmit={sendForm}
                  encType="multipart/form-data"
                  ref={formRef}
                  name={rc ? "editAd" : "addAd"}
                >
                  <div className="block w-full">
                    <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                      <div className="font-bold mb-2.5 text-sm">Название</div>
                      <div className="mb-5">
                        <Input
                          style={"w-full h-11 border-greyborder border"}
                          name={"name"}
                          defaultValue={rc && rc.name}
                          required={true}
                          minLength={3}
                          placeholder={"Название ЖК"}
                          onChange={changeFields}
                        />
                      </div>

                      <div className="font-bold mb-2.5 text-sm">
                        Название (ENG)
                      </div>
                      <div className="mb-5">
                        <Input
                          style={"w-full h-11 border-greyborder border"}
                          name={"second_name"}
                          defaultValue={rc && rc.second_name}
                          required={false}
                          minLength={3}
                          placeholder={"Название ЖК"}
                          onChange={changeFields}
                        />
                      </div>

                      <div className="font-bold mb-2.5 text-sm">Город</div>
                      <div className="mb-5">
                        <SelectNoAutocomplete
                          style={"w-full h-11 border-greyborder border"}
                          name={"city_link"}
                          type={"Город"}
                          defaultOption={
                            rc &&
                            rc.city_link &&
                            citiesList &&
                            citiesList.find(
                              (city) => city.id === rc.city_link.id
                            )
                          }
                          addCallback={changeFields}
                          options={citiesList}
                          callback={setSelectedCity}
                        />
                      </div>

                      {areasParentsList && areasParentsList.length ? (
                        <div className="my-2.5">
                          <div className="font-bold mb-2.5 text-sm">Район</div>
                          <SelectNoAutocomplete
                            style={"w-full h-11 border-greyborder border"}
                            nullable={true}
                            options={[
                              { name: "Не указывать", id: "" },
                              ...areasParentsList,
                            ]}
                            callback={setSelectedParentArea}
                            defaultValue={
                              defValueParent ? defValueParent : defValue
                            }
                          />
                        </div>
                      ) : (
                        ""
                      )}

                      {microAreasList && microAreasList.length ? (
                        <div className="my-2.5">
                          <div className="font-bold mb-2.5 text-sm">
                            Микрорайон
                          </div>
                          <SelectNoAutocomplete
                            style={"w-full h-11 border-greyborder border"}
                            nullable={true}
                            options={[
                              { name: "Не указывать", id: "" },
                              ...microAreasList,
                            ]}
                            callback={setSelectedMicroArea}
                            defaultValue={defValueParent ? defValue : null}
                          />
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="font-bold mb-2.5 text-sm">Адрес</div>

                      <Input
                        style={"w-full h-11 border-greyborder border "}
                        name={"address"}
                        defaultValue={rc && rc.address}
                        required={true}
                        placeholder={"Укажите адрес*"}
                        onChange={changeFields}
                        id={"suggest-address"}
                      />

                      <div className="mt-2">
                        <MapSuggestedInput
                          inputId={"suggest-address"}
                          address={mapAddress}
                          setAddress={setMapAddress}
                        />
                      </div>

                      <div className="font-bold text-sm my-2.5">Описание</div>
                      <div className="mb-5">
                        <Textarea
                          name="description"
                          onChange={changeFields}
                          defaultValue={rc && rc.description}
                          style={"py-2.5 border-greyborder border rounded"}
                          areaStyle={"rounded h-11"}
                          placeholder={"Описание ЖК"}
                        />
                      </div>

                      <div className="font-bold mb-2.5 text-sm">Строитель</div>
                      <div className="mb-5">
                        <Input
                          style={"w-full h-11 border-greyborder border "}
                          name={"builder"}
                          defaultValue={rc && rc.builder}
                          placeholder={"Строитель"}
                          onChange={changeFields}
                        />
                      </div>

                      <div className="font-bold mb-2.5 text-sm">
                        Год постройки
                      </div>
                      <div className="mb-5">
                        <Input
                          style={"w-full h-11 border-greyborder border "}
                          name={"build_year"}
                          defaultValue={rc && rc.build_year}
                          placeholder={"Год"}
                          onChange={changeFields}
                        />
                      </div>

                      <div className="font-bold mb-2.5 text-sm">Статус</div>
                      <div className="mb-5">
                        <SelectNoAutocomplete
                          style={"w-full h-11 border-greyborder border"}
                          nullable={true}
                          options={[
                            { name: "Не сдан", id: 2 },
                            { name: "Сдан", id: 1 },
                          ]}
                          addCallback={changeFields}
                          name={"status"}
                          defaultValue={rc?.status}
                        />
                      </div>

                      <div className="font-bold mb-2.5 text-sm">
                        Опубликовано
                      </div>
                      <div className="mb-5">
                        <SelectNoAutocomplete
                          style={"w-full h-11 border-greyborder border"}
                          name={"published"}
                          type={"Опубликовано"}
                          defaultOption={
                            rc &&
                            publishedValues &&
                            publishedValues[rc.published]
                          }
                          addCallback={changeFields}
                          options={publishedValues}
                        />
                      </div>

                      <FieldImages
                        name={"images"}
                        title={
                          <div className="font-bold mb-2.5 text-sm">
                            Фотографии
                          </div>
                        }
                        description={"   "}
                        isRequired={false}
                        setForm={setFields}
                        form={fields}
                        defaultImages={rc?.images && JSON.parse(rc?.images)}
                      />
                    </div>
                  </div>
                  {!MOBILE && (
                    <div className="flex justify-end w-full mt-[10px]">
                      <div className="w-[130px] h-[33px]">
                        <Button>Сохранить</Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </Container>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <PreloaderSpinner></PreloaderSpinner>
          </div>
        )}
      </div>
    </>
  );
}
