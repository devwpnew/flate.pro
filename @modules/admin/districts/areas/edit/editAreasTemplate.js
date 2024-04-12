import BackButton from "@modules/common/components/button/backButton";
import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import Input from "@modules/common/components/input/input";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import { formateDate } from "helpers/formateDate";
import getLayout from "helpers/getLayout";
import { useRouter } from "next/router";
import api from "pages/api/service/api";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function EditAreasTemplate({ areaId }) {
  const router = useRouter();
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(false);

  const user = useSelector((state) => state.userLogin.value);
  const [area, setArea] = useState(null);

  const formRef = useRef(null);
  const [fields, setFields] = useState({});
  const [citiesList, setCitiesList] = useState(null);
  const [areasParentsList, setAreasParentsList] = useState(null);

  useEffect(() => {
    (async function fetchAreas() {
      setIsLoading(true);

      if (areaId != "add") {
        const getArea = await api.get.areas({
          window_host: window.location.origin,
          filter: { id: areaId },
          limit: 1,
        });
        setArea(getArea);
      }

      const getCitiesList = await api.get.cities({ sort: { id: "asc" } });
      setCitiesList(getCitiesList);
      const getAreasList = await api.get.areas({
        filter: { link_city: selectedCity.id, parent_area: "null" },
      });
      // console.log(getAreasList, "getAreasList");
      setAreasParentsList(getAreasList);

      setIsLoading(false);
    })();
  }, [areaId, selectedCity]);

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

    let formData = new FormData(formRef.current);

    for (var key in fields) {
      if (formData.get(key)) {
        if (fields[key]) {
          formData.set(key, fields[key]);
        }
      } else {
        if (fields[key]) {
          formData.append(key, fields[key]);
        }
      }
    }

    const action = formRef.current.getAttribute("name");
    if (action == "editAd" && area && user) {
      formData.append("id", area.id);

      const res = await api.update.areas(formData, true);
      if (res) {
        alert("Район успешно изменён");
        router.push("/user/admin/districts");
      }
    } else if (action == "addAd") {
      const res = await api.add.areas(formData, true);

      if (res) {
        alert("Район успешно добавлен");
        router.push("/user/admin/districts");
      }
    }
  };

  const deleteAreaItem = async (e) => {
    e.preventDefault();
    const res = await api.remove.areas(areaId);
    if (res) {
      if (res.Error) {
        alert(res.Error);
      } else {
        alert("Район успешно удален");
        router.push("/user/admin/districts");
      }
    }
  };

  return (
    <div className="w-full">
      {area || areaId == "add" ? (
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
            {area ? (
              <H1>Редактировать {area.name}</H1>
            ) : (
              <H1>Добавить район</H1>
            )}
          </div>
          <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
            <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder">
              <div className="flex flex-col gap-5 mb-[35px]">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Дата создания</span>
                  <span className="text-grey text-sm">
                    {area?.date_created && formateDate(area.date_created)}
                  </span>
                </div>
                {area && area.date_edited && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      Последний раз редактировалось
                    </span>
                    {area.last_edited_by ? (
                      <Link
                        href={`/user/admin/users/${area.last_edited_by.id}`}
                      >
                        <a
                          className="text-blue cursor-pointer hover:underline underline-offset-2"
                          href={`/user/admin/users/${area.last_edited_by.id}`}
                        >
                          <div>ID: {`${area.last_edited_by.id} `}</div>
                          <div>
                            {area.last_edited_by.name
                              ? area.last_edited_by.name
                              : area.last_edited_by.phone}
                          </div>
                        </a>
                      </Link>
                    ) : (
                      ""
                    )}
                    <span className="text-grey text-sm">
                      {area?.date_edited && formateDate(area.date_edited)}
                    </span>
                  </div>
                )}
              </div>
              {area && (
                <div
                  className="flex flex-col gap-5 hover:underline"
                  onClick={deleteAreaItem}
                >
                  <span className="font-semibold text-sm cursor-pointer hover:underline">
                    Удалить район
                  </span>
                </div>
              )}
            </div>
            <div className="w-full px-5">
              <form
                onSubmit={sendForm}
                encType="multipart/form-data"
                ref={formRef}
                name={area ? "editAd" : "addAd"}
              >
                <div className="block w-full">
                  <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                    <div className="font-bold mb-2.5 text-sm">Название</div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"name"}
                        defaultValue={area && area.name}
                        required={true}
                        minLength={3}
                        placeholder={"Название района"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">
                      Символьный код
                    </div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"slug"}
                        defaultValue={area && area.slug}
                        // required={true}
                        minLength={3}
                        placeholder={"Символьный код"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">Город</div>
                    <div className="mb-5">
                      <SelectNoAutocomplete
                        style={"w-full h-11 border-greyborder border"}
                        name={"link_city"}
                        defaultValue={
                          area &&
                          area.link_city &&
                          citiesList &&
                          citiesList.find(
                            (city) => city.id === area.link_city.id
                          )
                        }
                        callback={setSelectedCity}
                        addCallback={changeFields}
                        options={citiesList ? citiesList : null}
                      />
                    </div>

                    {areasParentsList && (
                      <>
                        <div className="font-bold mb-2.5 text-sm">
                          Является подрайоном
                        </div>
                        <div className="mb-5">
                          <SelectNoAutocomplete
                            style={"w-full h-11 border-greyborder border"}
                            name={"parent_area"}
                            nullable={true}
                            defaultOption={
                              area &&
                              area.parent_area &&
                              areasParentsList &&
                              areasParentsList.find(
                                (areaParent) =>
                                  areaParent.id === area.parent_area.id
                              )
                            }
                            addCallback={changeFields}
                            options={
                              areasParentsList
                                ? [
                                    { name: "Не указывать", id: "" },
                                    ...areasParentsList,
                                  ]
                                : null
                            }
                          />
                        </div>
                      </>
                    )}
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
  );
}
