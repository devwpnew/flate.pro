import H1 from "@modules/common/components/heading/h1";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import BackButton from "@modules/common/components/button/backButton";

import getLayout from "helpers/getLayout";
import API from "pages/api/service/api";
import { useEffect, useState } from "react";
import api from "pages/api/service/api";
import Link from "next/link";
import TablePreloader from "@modules/common/components/preloader/tablePreloader";
import Table from "@modules/common/components/admin/table/table";
import { formateDate } from "helpers/formateDate";

export default function AdminCitiesContent({ user }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  const [data, setData] = useState(false);

  const [citiesListLoading, setCitiesListLoading] = useState(true);
  const [citiesList, setCitiesList] = useState(null);

  useEffect(() => {
    (async function fetchDistrict() {
      setCitiesListLoading(true);
      const cities = await API.get.cities({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        limit: "all",
      });

      const resCities = await Promise.all(
        cities.map(async (city) => {
          const test = await API.get.product.count({
            city_link: city.id,
            published: "1",
          });
          city.productsCount = test;
          return city;
        })
      );

      setCitiesList(resCities);

      const data = [];

      resCities.map((city) => {
        // console.log(city);
        const cityObject = {
          ID: (
            <Link href={`/user/admin/cities/${city.id}`}>
              <a>{city.id}</a>
            </Link>
          ),
          Название: (
            <Link href={`/user/admin/cities/${city.id}`}>
              <a>{city.name}</a>
            </Link>
          ),
          "Дата создания": <>{formateDate(city.date_created)} г</>,
          "Дата редактирования": (
            <>{city.date_edited && formateDate(city.date_edited) + " г"}</>
          ),
          Объявлений: city?.productsCount.count,
        };

        data.push(cityObject);
      });

      setData(data);
      setCitiesListLoading(false);
    })();
  }, []);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Города</H1>
      </div>
      <div className="table-container">
        <Table data={data} isLoading={citiesListLoading} />
      </div>
    </MotionContainer>
  );
}
