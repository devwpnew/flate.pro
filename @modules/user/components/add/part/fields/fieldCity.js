import api from "pages/api/service/api";

import { useEffect, useState } from "react";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import Preloader from "@modules/common/components/preloader/preloader";

export default function FieldCity({ setCityId, rcInfo }) {
  const [selected, setSelected] = useState(null);

  const [citiesListLoading, setCitiesListLoading] = useState(true);
  const [citiesList, setCitiesList] = useState(null);

  useEffect(() => {
    (async function fetchDistrict() {
      setCitiesListLoading(true);

      const cities = await api.get.cities({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
      });

      setCitiesList(cities);
      setCitiesListLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selected?.id) {
      setCityId(selected.id);
    }
  }, [selected]);

  return (
    <>
      <div className="text-sm font-bold mb-2">Город</div>
      <div className="h-10 w-full md:w-[300px]">
        {citiesListLoading ? (
          <Preloader />
        ) : (
          <div className="h-full w-full md:w-[300px]">
            <SelectNoAutocomplete
              key={rcInfo?.city_link?.id}
              placeholder="Город"
              name={"city_link"}
              callback={setSelected}
              options={citiesList}
              defaultValue={rcInfo?.city_link?.id && rcInfo?.city_link.id}
            />
          </div>
        )}
      </div>
    </>
  );
}
