import API from "pages/api/service/api";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { setCity } from "store/global/user/userCity";

import SelectOptions from "@modules/common/components/select/listBox/part/selectOptions";
import SelectButton from "@modules/common/components/select/listBox/part/selectButton";

export default function citySelect({
  name,
  style,
  setState,
  type,
  callback,
  topTitle,
}) {
  const dispatch = useDispatch();

  const activeCity = useSelector((state) => state.userCity.value);
  const [selected, setSelected] = useState(activeCity);

  const [isLoading, setLoading] = useState(true);
  const [cities, setCities] = useState(null);

  useEffect(() => {
    (async function fetchData() {
      setLoading(true);
      setCities(
        await API.get.cities({
          window_host: window.location.origin,
          select: ["id", "name"],
        })
      );
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async function setActiveSityGlobal() {
      dispatch(setCity(selected));
    })();
  }, [selected]);

  useEffect(() => {
    (async function setActiveSity() {
      setSelected(activeCity);
    })();
  }, [activeCity]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative w-full h-full">
        <SelectButton
          selected={selected}
          name={name}
          style={style}
          topTitle={topTitle}
        />
        {cities && <SelectOptions options={cities} />}
      </div>
    </Listbox>
  );
}
