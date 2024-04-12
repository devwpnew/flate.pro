import BackButton from "@modules/common/components/button/backButton";
import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import Input from "@modules/common/components/input/input";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import getLayout from "helpers/getLayout";
import { useRouter } from "next/router";
import api from "pages/api/service/api";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CitiesAreasList from "../areas/citiesAreasList";
import { formateDate } from "helpers/formateDate";

export default function EditCitiesTemplate({ cityId }) {
  const router = useRouter();
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  const user = useSelector((state) => state.userLogin.value);
  const [city, setCity] = useState(null);

  const formRef = useRef(null);
  const [fields, setFields] = useState({});

  useEffect(() => {
    (async function fetchCities() {
      if (cityId != "add") {
        const getCity = await api.get.cities({
          window_host: window.location.origin,
          filter: { id: cityId },
          limit: 1,
        });
        setCity(getCity);
      }
    })();
  }, [cityId]);

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
        formData.set(key, fields[key]);
      } else {
        formData.append(key, fields[key]);
      }
    }

    const action = formRef.current.getAttribute("name");
    if (action == "editAd" && city && user) {
      formData.append("id", city.id);
      const res = await api.update.cities(formData, true);
      if (res) {
        alert("Город успешно изменён");
        router.push("/user/admin/cities");
      }
    } else if (action == "addAd") {
      const res = await api.add.cities(formData, true);
      if (res) {
        alert("Город успешно добавлен");
        router.push("/user/admin/cities");
      }
    }
  };

  const deleteCityItem = async (e) => {
    e.preventDefault();
    // console.log('cityId', cityId)
    const res = await api.remove.cities(cityId);
    if (res) {
      if (res.Error) {
        alert(res.Error);
      } else {
        alert("Город успешно удален");
        router.push("/user/admin/cities");
      }
    }
  };

  return (
    <div className="w-full">
      {city || cityId == "add" ? (
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
            {city ? (
              <H1>Редактировать {city.name}</H1>
            ) : (
              <H1>Добавить город</H1>
            )}
          </div>
          <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
            <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder">
              <div className="flex flex-col gap-5 mb-[35px]">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Дата создания</span>
                  <span className="text-grey text-sm">
                    {new Date(
                      city && city.date_created ? city.date_created : new Date()
                    ).toLocaleDateString(process.env.Timezone)}
                  </span>
                </div>
                {city && city.date_edited && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      Последний раз редактировалось
                    </span>
                    {city.last_edited_by ? (
                      <Link
                        href={`/user/admin/users/${city.last_edited_by.id}`}
                      >
                        <a
                          className="text-blue cursor-pointer hover:underline underline-offset-2"
                          href={`/user/admin/users/${city.last_edited_by.id}`}
                        >
                          <div>ID: {`${city.last_edited_by.id} `}</div>
                          <div>
                            {city.last_edited_by.name
                              ? city.last_edited_by.name
                              : city.last_edited_by.phone}
                          </div>
                        </a>
                      </Link>
                    ) : (
                      ""
                    )}
                    <span className="text-grey text-sm">
                      {city.date_edited && formateDate(city.date_edited)}
                    </span>
                  </div>
                )}
              </div>
              {city && (
                <div
                  className="flex flex-col gap-5 hover:underline"
                  onClick={deleteCityItem}
                >
                  <span className="font-semibold text-sm cursor-pointer hover:underline">
                    Удалить город
                  </span>
                </div>
              )}
            </div>
            <div className="w-full px-5">
              <form
                onSubmit={sendForm}
                encType="multipart/form-data"
                ref={formRef}
                name={city ? "editAd" : "addAd"}
              >
                <div className="block w-full">
                  <div className="pt-3 pb-7 md:border-b-[1px] md:border-greyborder">
                    <div className="font-bold mb-2.5 text-sm">Название</div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"name"}
                        defaultValue={city && city.name}
                        required={true}
                        minLength={3}
                        placeholder={"Название города"}
                        onChange={changeFields}
                      />
                    </div>

                    <div className="font-bold mb-2.5 text-sm">
                      Название (вин. п.)
                    </div>
                    <div className="mb-5">
                      <Input
                        style={"w-full h-11 border-greyborder border"}
                        name={"in_name"}
                        defaultValue={city && city.in_name}
                        required={true}
                        minLength={3}
                        placeholder={"Название (в 'городе')"}
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
                        defaultValue={city && city.slug}
                        required={true}
                        minLength={3}
                        placeholder={"Символьный код"}
                        onChange={changeFields}
                      />
                    </div>

                    <CitiesAreasList cityId={cityId} />
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
