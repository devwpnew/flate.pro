import api from "pages/api/service/api";
import { useEffect, useState } from "react";

import Link from "next/link";
import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";
import TablePreloader from "@modules/common/components/preloader/tablePreloader";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import Table from "@modules/common/components/admin/table/table";
import { formateDate } from "helpers/formateDate";

// const getReportText = (id) => {
//   const options = [
//     {
//       name: "Уже продано",
//       id: "0",
//     },
//     {
//       name: "Неверная цена",
//       id: "1",
//     },
//     {
//       name: "Неверное описание или фото",
//       id: "2",
//     },
//     {
//       name: "Не дозвониться",
//       id: "3",
//     },
//     {
//       name: "Другая причина",
//       id: "4",
//     },
//   ];

//   const res = options[id];

//   return res?.name;
// };

export default function AdminReportsContent({ user }) {
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      let res = await api.get.reports({
        sort: {
          date_created: "desc",
        },
        limit: "all",
      });
      const sections = await api.get.sections({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        filter: {
          active: true,
        },
      });

      const data = [];

      if (!res) {
        res = [];
      }

      if (sections && sections.length > 0) {
        // console.log(sections);
        res.map((item) => {
          const slugId =
            item?.product?.section_relation &&
            item?.product?.section_relation[0];

          const section = sections.find((el) => el.id == slugId);

          const newsObject = {
            ID: (
              <>{item.id}</>
              // <Link href={`/user/admin/users/${item?.user_id?.id}`}>
              //   <a>{item.id}</a>
              // </Link>
            ),

            Объявление: (
              <Link
                href={
                  item?.product.slug
                    ? `/posts/${section?.slug}/${item?.product.slug}`
                    : "#"
                }
              >
                <a target="_blank">{item?.product?.name}</a>
              </Link>
            ),
            Пользователь: (
              <Link href={`/user/admin/users/${item?.user_id?.id}`}>
                <a>
                  {item?.user_id?.user_name}{" "}
                  {item?.user_id?.id && "(ID): " + item?.user_id?.id}
                </a>
              </Link>
            ),
            Сообщение: <span>{item.text}</span>,
            Дата: (
              <>{item.date_created && formateDate(item.date_created) + " г"}</>
            ),
          };

          data.push(newsObject);
        });

        setData(data);
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Жалобы</H1>
      </div>
      <div className="table-container">
        <Table data={data} isLoading={isLoading} />
      </div>
    </MotionContainer>
  );
}
