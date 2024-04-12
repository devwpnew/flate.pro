import API from "pages/api/service/api";
import { useEffect, useState } from "react";

import Link from "next/link";
import H1 from "@modules/common/components/heading/h1";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import MotionContainer from "@modules/common/components/container/motionContainer";

import TablePreloader from "@modules/common/components/preloader/tablePreloader";
import Preloader from "@modules/common/components/preloader/preloader";
import Table from "@modules/common/components/admin/table/table";

const publishedStatus = {
  0: "На модерации",
  1: "Да",
  2: "Архив",
  3: "Отклонено",
  4: "Заблокировано",
};

export default function AdminDistrictsContent({ user, type }) {
  const [data, setData] = useState(null);

  const [jkListLoading, setJkListLoading] = useState(true);
  const [districtList, setDistrictList] = useState(null);
  const [jkList, setJkList] = useState(null);

  const [cityId, setCityId] = useState(null);
  const [cities, setCities] = useState(null);

  useEffect(() => {
    (async function fetchDistrict() {
      if (type === "rcs" || type === "requests") return;

      const districts = await API.get.areas({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        limit: "all",
      });
      setDistrictList(districts);
    })();
  }, []);

  useEffect(() => {
    (async function fetchJk() {
      setJkListLoading(true);

      let filter = {};

      if (cityId?.id) {
        filter["city_link"] = cityId.id;
      }

      let rcs = await API.get.rcs({
        window_host: window.location.origin,
        filter,
        sort: {
          id: "asc",
        },
        limit: "all",
      });

      if (!rcs) {
        rcs = [];
      }

      const data = [];

      rcs.map((rc) => {
        // console.log(rc?.published);

        if (type === "requests" && rc?.published !== 0) return;

        const productObject = {
          ID: (
            <Link href={`/user/admin/rcs/${rc.id}?moderation=1`}>
              <a>{rc.id}</a>
            </Link>
          ),
          Название: (
            <Link href={`/user/admin/rcs/${rc.id}?moderation=1`}>
              <a>{rc.name}</a>
            </Link>
          ),
          Опубликован: <span>{publishedStatus[rc?.published]}</span>,
          Город: rc?.city_link?.name,
          Район: <span>{rc?.area_link.name}</span>,
          Адрес: <span>{rc?.address}</span>,
        };

        data.push(productObject);
      });

      setData(data);
      setJkListLoading(false);
    })();
  }, [cityId]);

  useEffect(() => {
    (async function fetchData() {
      const fetched = await API.get.cities({
        window_host: window.location.origin,
        select: ["id", "name"],
      });

      setCities([{ name: "Все города", id: null }, ...fetched]);
    })();
  }, []);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>
          {type === "rcs" && "Жилые комплексы"}
          {type === "requests" && "Заявки на добавление ЖК"}
          {!type && "База: Жилые комплексы / Районы"}
        </H1>
      </div>

      <div className="flex justify-between gap-2.5 mt-2.5">
        {cities ? (
          <SelectNoAutocomplete
            defaultOption={cityId?.id}
            options={cities}
            style={"h-[42px]"}
            callback={setCityId}
          />
        ) : (
          <div className="mx-auto w-full h-[48px]">
            <Preloader />
          </div>
        )}
      </div>

      <div className="table-container">
        <Table data={data} isLoading={jkListLoading} />
      </div>
    </MotionContainer>
  );
}
