import { useEffect, useState } from "react";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Preloader from "@modules/common/components/preloader/preloader";

import useFilterProps from "hooks/filter/useFilterProps";

export default function FieldStatus({ sectionId, form, setForm, product }) {
  const [defValue, setDefValue] = useState(null);

  const [selected, setSelected] = useState("");

  const [isOptionsChange, setIsOptionsChange] = useState(false);

  const [currentOptionsName, setCurrentOptionsName] = useState(null);
  const [currentOptions, setCurrentOptions] = useState(null);

  const { data, error, isLoading } = useFilterProps([
    "status",
    "house_types",
    "status_lands",
    "commercial_types",
    "parking_types",
  ]);

  useEffect(() => {
    if (!data) return;
    setIsOptionsChange(true);

    if (sectionId === 3 && data?.status) {
      setCurrentOptionsName("status");
      setCurrentOptions(data.status);

      if (product) {
        setDefValue(product.status);
      }
    }

    if (sectionId === 4 && data?.house_types) {
      setCurrentOptionsName("house_types");
      setCurrentOptions(data.house_types);

      if (product) {
        setDefValue(product.house_types);
      }
    }

    if (sectionId === 5 && data?.status_lands) {
      setCurrentOptionsName("status_lands");
      setCurrentOptions(data.status_lands);

      if (product) {
        setDefValue(product.status_lands);
      }
    }

    if (sectionId === 6 && data?.commercial_types) {
      setCurrentOptionsName("commercial_types");
      setCurrentOptions(data.commercial_types);

      if (product) {
        setDefValue(product.commercial_types);
      }
    }

    if (sectionId === 7 && data?.parking_types) {
      setCurrentOptionsName("parking_types");
      setCurrentOptions(data.parking_types);

      if (product) {
        setDefValue(product.parking_types);
      }
    }

    setIsOptionsChange(false);
  }, [data, sectionId]);

  useEffect(() => {
    if (sectionId === 3) {
      setForm({ ...form, status: selected.id });
    }

    if (sectionId === 4) {
      setForm({ ...form, house_types: selected.id });
    }

    if (sectionId === 5) {
      setForm({ ...form, status_lands: selected.id });
    }

    if (sectionId === 6) {
      setForm({ ...form, commercial_types: selected.id });
    }

    if (sectionId === 7) {
      setForm({ ...form, parking_types: selected.id });
    }
  }, [selected]);

  return (
    <div className="mb-5">
      <div className="text-sm font-bold mb-2">
        {sectionId === 6 || sectionId === 7 || sectionId === 4
          ? "Вид"
          : "Статус"}<span className="text-red">*</span>
      </div>

      <div className="h-10 w-full md:w-[300px]">
        {isOptionsChange || isLoading || error ? (
          <Preloader />
        ) : (
          <div className="h-full w-full md:w-[300px]">
            <SelectNoAutocomplete
              key={currentOptions}
              placeholder="Выберите статус объекта"
              name={currentOptionsName}
              callback={setSelected}
              // options={currentOptions}
              options={
                currentOptions && [
                  ...[
                    {
                      name: "Не выбрано",
                      id: "",
                    },
                  ],
                  ...currentOptions,
                ]
              }
              defaultValue={defValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* <>
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
</>; */
}
