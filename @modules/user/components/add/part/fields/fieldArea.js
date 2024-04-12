import api from "pages/api/service/api";

import { useState, useEffect } from "react";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Preloader from "@modules/common/components/preloader/preloader";

export default function FieldArea({ cityId, setAreaId, rcInfo, product }) {
  const [defValue, setDefValue] = useState(null);

  const [selected, setSelected] = useState(null);
  const [areas, setAreas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function fetchAreas() {
      if (cityId) {
        setIsLoading(true);
        const areas = await api.get.areasList(cityId);

        if (areas.length > 0) {
          setAreas(areas);
        } else {
          setAreas([{ name: "Не выбрано", id: "null" }]);
        }

        setIsLoading(false);
      }
    })();
  }, [cityId]);

  useEffect(() => {
    // if (selected && selected?.id !== 'null') {
    setAreaId(selected?.id);
    // }
  }, [selected]);

  useEffect(() => {
    if (product) {

      if(product?.area_link?.parent_area) {
        setDefValue(product?.area_link?.parent_area)
        return;
      }

      if(product?.area_link?.id) {
        setDefValue(product?.area_link?.id);
        return
      }
    }

    if (rcInfo) {

      if(rcInfo?.area_link?.parent_area) {
        setDefValue(rcInfo?.area_link?.parent_area)
        return;
      }

      if(rcInfo?.area_link?.id) {
        setDefValue(rcInfo?.area_link?.id);
        return
      }

    }
  }, [rcInfo, product]);
  
  return (
    <>
      <div className="text-sm font-bold mb-2">Район</div>

      <div className="h-10 w-full md:w-[300px]">
        {isLoading ? (
          <Preloader />
        ) : (
          areas && (
            <SelectNoAutocomplete
              placeholder="Район"
              callback={setSelected}
              options={[{ name: "Не указано", id: "" }, ...areas]}
              defaultValue={defValue}
            />
          )
        )}
      </div>
    </>
  );
}
