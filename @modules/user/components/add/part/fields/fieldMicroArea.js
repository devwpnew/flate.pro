import api from "pages/api/service/api";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import SelectNoAutocompleteWithLevels from "@modules/common/components/select/listBox/selectNoAutocompleteWithLevels";
import Preloader from "@modules/common/components/preloader/preloader";

export default function FieldMicroArea({
  cityId,
  setMicroAreaId,
  areaId,
  rcInfo,
  product,
}) {
  const [defValue, setDefValue] = useState(null);

  const [selected, setSelected] = useState(null);
  const [areas, setAreas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function fetchAreas() {
      if (cityId && areaId) {
        setIsLoading(true);

        const areas = await api.get.areas({
          window_host: window.location.origin,
          filter: {
            city_link: cityId,
            parent_area: areaId,
          },
          sort: {
            id: "asc",
          },
          limit: "all",
        });

        if (areas?.length > 0) {
          setAreas([{ name: "Не выбрано", id: "null" }].concat(areas));
        } else {
          setAreas([{ name: "Не выбрано", id: "null" }]);
        }

        setIsLoading(false);
      } else {
        setAreas([{ name: "Не выбрано", id: "null" }]);
      }
    })();
  }, [cityId]);

  useEffect(() => {
    if (selected && selected?.id !== "null") {
      setMicroAreaId(selected.id);
    }
  }, [selected]);

  useEffect(() => {
    if (product) {
      if (product?.area_link?.id) {
        setDefValue(product?.area_link?.id);
        return;
      }
    }

    if (rcInfo) {
      if (rcInfo?.area_link?.id) {
        setDefValue(rcInfo?.area_link?.id);
        return;
      }
    }
  }, [rcInfo, product]);
  return (
    <div className="w-full">
      <div className="text-sm font-bold mb-2">Микрорайон</div>

      <div className="h-10 w-full">
        {isLoading ? (
          <Preloader />
        ) : (
          areas && (
            <div className="h-full w-full">
              <SelectNoAutocomplete
                placeholder="Микрорайон"
                callback={setSelected}
                options={[{ name: "Не указано", id: "" }, ...areas]}
                defaultValue={defValue}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
