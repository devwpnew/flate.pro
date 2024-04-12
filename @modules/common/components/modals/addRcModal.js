import api from "pages/api/service/api";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFetchState } from "store/global/helpers/fetchTrigger";

import Button from "../button/button";

import DialogCloseIcon from "../dialog/dialogCloseIcon";
import Textarea from "../textarea/textarea";
import InputRequired from "../input/inputRequaired";
import MapSuggestedInput from "../map/mapSuggestedInput";

import DialogMessage from "../dialog/dialogMessage";
import SelectNoAutocomplete from "../select/listBox/selectNoAutocomplete";

export default function AddRcModal({
  setIsOpenAddRc,
  isOpenAddRc,
  setIsOpenRcSuccess,
  rcAddedCallback,
}) {
  const dispatch = useDispatch();
  const fetchState = useSelector((state) => state.fetchTrigger.value);
  
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(false);

  const [selectedCity, setSelectedCity] = useState({ name: "Сочи", id: 5 });
  const [selectedParentArea, setSelectedParentArea] = useState(null);
  const [selectedMicroArea, setSelectedMicroArea] = useState(null);

  const [microAreasList, setMicroAreasList] = useState(null);
  const [areasParentsList, setAreasParentsList] = useState(null);
  const [citiesList, setCitiesList] = useState(null);
  
  const [rcCity, setRcCity] = useState(false);
  const [rcForm, setRcForm] = useState({});

  const [rcAddress, setRcAddress] = useState(null);

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

  const onRcFormChange = (fieldName, fieldValue) => {
    let newRcFormValue = rcForm;
    newRcFormValue[fieldName] = fieldValue;
    setRcForm(newRcFormValue);
  };

  const sendRcForm = async (ev) => {
    ev.preventDefault();

    if (!rcForm.name || !rcAddress) {
      setError(true);
      return;
    }

    const addRcFormData = new FormData();
    addRcFormData.set("name", rcForm.name);
    addRcFormData.set("address", rcAddress);

    if (selectedCity) {
      addRcFormData.set("city_link", selectedCity.id);
    }

    if (selectedParentArea?.id) {
      addRcFormData.set("area_link", selectedParentArea.id);
    }

    if (selectedMicroArea?.id) {
      addRcFormData.set("area_link", selectedMicroArea.id);
    }

    if (rcForm.description) {
      addRcFormData.set("description", rcForm.description);
    }

    // addRcFormData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    const res = await api.add.rcs(addRcFormData, rcCity);

    if (res && !res.error) {
      rcAddedCallback(res);
      setIsOpenAddRc(false);
      setIsOpenRcSuccess(true);
      dispatch(setFetchState(!fetchState));
    } else {
      setError(res.error);
      // console.log(res);
    }
  };

  // console.log(selectedParentArea, 'selectedParentArea');
  // console.log(selectedCity, 'selectedCity');
  // console.log(microAreasList, 'microAreasList');

  return (
    <>
      {error ? (
        <DialogMessage
          className="bg-inherit"
          isShow={error}
          onClose={() => setError(false)}
          title="Произошла ошибка."
          subtitle="Проверьте правильность ввода и повторите
    попытку"
        />
      ) : (
        <div className="relative">
          <div className={"text-3xl font-extrabold text-center mb-5 block"}>
            Добавить ЖК
          </div>
          <DialogCloseIcon
            onClick={() => setIsOpenAddRc(!isOpenAddRc)}
            className="absolute top-5 right-5"
          />

          <div className="flex flex-col">
            <InputRequired
              required={true}
              topTitle={"Название"}
              inputStyle={"h-10"}
              labelStyle={"my-2.5"}
              placeholder={"Название ЖК*"}
              defaultValue={rcForm.name}
              onChange={(e) => onRcFormChange("name", e.target.value)}
            />

            <div className="my-2.5">
              <SelectNoAutocomplete
                required={true}
                topTitle="Город"
                style={"w-full h-11 border-greyborder border"}
                type={"Город"}
                options={citiesList}
                callback={setSelectedCity}
              />
            </div>

            {areasParentsList && areasParentsList.length ? (
              <div className="my-2.5">
                <SelectNoAutocomplete
                  topTitle={"Район"}
                  style={"w-full h-11 border-greyborder border"}
                  nullable={true}
                  options={[
                    { name: "Не указывать", id: "" },
                    ...areasParentsList,
                  ]}
                  callback={setSelectedParentArea}
                />
              </div>
            ) : (
              ""
            )}

            {microAreasList && microAreasList.length ? (
              <div className="my-2.5">
                <SelectNoAutocomplete
                  topTitle={"Микрорайон"}
                  style={"w-full h-11 border-greyborder border"}
                  nullable={true}
                  options={[
                    { name: "Не указывать", id: "" },
                    ...microAreasList,
                  ]}
                  callback={setSelectedMicroArea}
                />
              </div>
            ) : (
              ""
            )}

            <InputRequired
              required={true}
              topTitle={"Адрес"}
              inputStyle={"h-10"}
              labelStyle={"my-2.5"}
              placeholder={"Укажите адрес или передвиньте метку на карте*"}
              value={rcAddress && rcAddress}
              onChange={(ev) => setRcAddress(ev.target.value)}
              id="suggest"
            />

            <Textarea
              topTitle={"Описание"}
              labelStyle={"my-2.5 py-2.5"}
              placeholder={"Описание"}
              defaultValue={rcForm.description}
              onChange={(e) => onRcFormChange("description", e.target.value)}
            />

            <div className="mb-2.5" id="custom-suggest">
              <MapSuggestedInput
                inputId={"suggest"}
                address={rcAddress}
                setAddress={setRcAddress}
                setCity={setRcCity}
              />
            </div>

            <div className="h-[37px] w-[102px] self-end">
              <Button type={'button'} onClick={sendRcForm}>Далее</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
