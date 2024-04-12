import API from "pages/api/service/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";

import Pagination from "@modules/common/components/pagination/pagination";
import Preloader from "@modules/common/components/preloader/preloader";
import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import Table from "@modules/common/components/admin/table/table";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import { formateDate } from "helpers/formateDate";

const publishedStatus = {
  0: "На модерации",
  1: "Да",
  2: "Архив",
  3: "Отклонено",
  4: "Заблокировано",
};

export default function AdminModerationContent({ isModeration, isArchive }) {
  const router = useRouter();
  const userIdFilterQuery = router.query?.user;

  const [data, setData] = useState(null);

  const [sort, setSort] = useState({ date_sort: "desc" });

  const page = router.query?.page;

  const itemsLimit = 20;

  const [productsListLoading, setProductsListLoading] = useState(true);
  const [productsAmount, setProductsAmount] = useState(null);

  const [cityId, setCityId] = useState(null);
  const [cities, setCities] = useState(null);

  const [sectionId, setSectionId] = useState(null);
  const [sections, setSections] = useState(null);

  const [usersFilterId, setUsersFilterId] = useState(
    userIdFilterQuery ? [userIdFilterQuery] : false
  );
  const [usersFilter, setUsersFilter] = useState(null);

  useEffect(() => {
    (async function fetchProducts() {
      setProductsListLoading(true);
      const filter = {};

      if (isModeration) {
        filter["published"] = ['0', '3'];
      }

      if (isArchive) {
        filter["published"] = ['2', '4'];
      }

      if (usersFilterId && usersFilterId.length > 0) {
        filter["user_id"] = usersFilterId;
      }

      if (sectionId?.id && sectionId?.id !== "all") {
        filter["section_relation"] = sectionId.id;
      }

      if (cityId?.id) {
        filter["city_link"] = cityId.id;
      }

      const params = {
        window_host: window.location.origin,
        filter,
        sort: {
          ...sort,
        },
        limit: "all",
      };

      if (page) {
        params["page"] = page;
      }

      let products = await API.get.product.list(params);

      if (!products) {
        products = [];
      }
      const data = [];

      products.map((product) => {
        const productObject = {
          ID: (
            <div id="id" data-col="ID">
              <Link href={`/user/admin/items/${product.id}`}>
                <a>{product.id}</a>
              </Link>
            </div>
          ),
          Название: (
            <div id="name" data-col="Название">
              <Link href={getProductUrl(product)}>
                <a target="_blank">{product.name}</a>
              </Link>
            </div>
          ),
          Опубликован: (
            <div id="published" data-col="Опубликован">
              {publishedStatus[product.published]}
            </div>
          ),
          "Дата создания": (
            <div id="date_created" data-col="Дата создания">
              {product?.date_created && formateDate(product.date_created)} г
            </div>
          ),
          "Дата изменения": (
            <div id="date_edited" data-col="Дата изменения">
              {product?.date_edited && formateDate(product.date_edited)} г
            </div>
          ),
          "Пользователь (ID)": (
            <div id="user_id" data-col="Пользователь (ID)">
              <Link href={`/users/${product?.user_id?.id}`}>
                <a>{product?.user_id?.id}</a>
              </Link>
            </div>
          ),
          Адрес: (
            <div id="product_address">
              {product?.properties?.product_address}
            </div>
          ),
          Район: (
            <div id="area_link" data-col="Район">
              {product?.area_link?.name}
            </div>
          ),
          "Жилой комплекс": (
            <div id="rc_link" data-col="Жилой комплекс">
              {product?.rc_link?.name}
            </div>
          ),
          Дом: (
            <div id="building_link" data-col="Дом">
              {product?.building_link?.name}
            </div>
          ),
        };

        data.push(productObject);
      });

      setData(data);
      setProductsAmount(data.length);
      setProductsListLoading(false);
    })();
  }, [cityId, sectionId, sort, page, usersFilterId]);

  // filters
  useEffect(() => {
    (async function fetchData() {
      const fetched = await API.get.cities({
        window_host: window.location.origin,
        select: ["id", "name"],
      });

      setCities([{ name: "Все города", id: null }, ...fetched]);
    })();
  }, []);

  useEffect(() => {
    (async function fetchData() {
      const fetched = await API.get.sections({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        filter: {
          active: true,
        },
      });

      setSections(fetched);
    })();
  }, []);

  useEffect(() => {
    (async function fetchData() {
      const fetched = await API.get.user({
        window_host: window.location.origin,
        // select: ["id", "name"],
        limit: "all",
      });

      setUsersFilter([
        // { name: "Все пользователи", id: null },
        ...fetched.map((user) => {
          return { id: user.id, name: `[${user.id}] ${user?.user_name}` };
        }),
      ]);
    })();
  }, []);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1 additionalClass="inline-flex items-center gap-2">
          <span>{isModeration ? "Модерация" : "Архив"}:</span>
          {!productsListLoading ? (
            productsAmount
          ) : (
            <div className={"inline-flex w-24 h-[48px]"}>
              <Preloader />
            </div>
          )}
        </H1>
      </div>

      <div className="flex justify-between gap-2.5 mt-2.5">
        {sections ? (
          <SelectNoAutocomplete
            defaultOption={sectionId?.id}
            options={[{ name: "Все объявления", id: "all" }, ...sections]}
            style={"h-[42px]"}
            callback={setSectionId}
            topTitle={"Категория"}
          />
        ) : (
          <div className="mx-auto w-full h-[48px]">
            <Preloader />
          </div>
        )}

        {cities ? (
          <SelectNoAutocomplete
            defaultOption={cityId?.id}
            options={cities}
            style={"h-[42px]"}
            callback={setCityId}
            topTitle={"Город"}
          />
        ) : (
          <div className="mx-auto w-full h-[48px]">
            <Preloader />
          </div>
        )}

        {usersFilter ? (
          <SelectMultiSelect
            defaultOption={usersFilterId?.id}
            options={usersFilter}
            style={"h-[42px]"}
            callback={setUsersFilterId}
            topTitle={"Пользователи"}
          />
        ) : (
          // <SelectNoAutocomplete
          //   defaultOption={usersFilterId?.id}
          //   options={usersFilter}
          //   style={"h-[42px]"}
          //   callback={setUsersFilterId}
          // />
          <div className="mx-auto w-full h-[48px]">
            <Preloader />
          </div>
        )}
      </div>

      <div className="table-container">
        <Table data={data} isLoading={productsListLoading} setSort={setSort} />
      </div>

      {/* {!productsListLoading ? (
        <Pagination
          itemsAmount={productsAmount && productsAmount}
          itemsLimit={itemsLimit && itemsLimit}
        />
      ) : (
        <div className="mx-auto w-28 h-5 mt-2.5">
          <Preloader />
        </div>
      )} */}
    </MotionContainer>
  );
}
