import Button from "@modules/common/components/button/button";
import AdminToolsButton from "@modules/posts/type/product/components/item/part/admitToolsButton";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "pages/api/service/api";
import { formateDate } from "helpers/formateDate";

const getReportText = (id) => {
  const options = [
    {
      name: "Уже продано",
      id: "0",
    },
    {
      name: "Неверная цена",
      id: "1",
    },
    {
      name: "Неверное описание или фото",
      id: "2",
    },
    {
      name: "Не дозвониться",
      id: "3",
    },
    {
      name: "Другая причина",
      id: "4",
    },
  ];

  const res = options[id];

  return res?.name;
};

export default function ReportItem({ report, section }) {
  const user = useSelector((state) => state.userLogin.value);

  const [isSuccess, setIsSuccess] = useState(false);

  const closeTask = async () => {
    if (!isSuccess) {
      const res = await api.update.reports({
        id: report.id,
        status: 5,
      });

      // console.log(res);

      if (res.data.itemId) {
        setIsSuccess(true);
      }
    }
  };
  return (
    <div className="relative">
      <div className="p-2.5 border-l-red border-l-2 rounded rounded-l-none shadow-md mb-5 cursor-pointer hover:shadow-lg bg-greylight">
        <div className="pr-[20px]">
          <div className="mb-2">
            <span className="text-xs">
              {report.date_created && formateDate(report.date_created)}
            </span>
            <br />
            Жалоба на объявление <br />
            <Link href={`/posts/${section?.slug}/${report?.product.slug}`}>
              <span className="hover:underline cursor-pointer text-bluedeep">
                {report?.product?.name}
              </span>
            </Link>
            <AdminToolsButton
              user={user}
              product={report.product}
              className="absolute top-0 right-2.5 cursor-pointer z-1"
            />
          </div>
          <div className="text-sm text-grey">{getReportText(report?.text)}</div>
          <Button
            isDisabled={isSuccess}
            onClick={closeTask}
            type={"green"}
            className={"w-auto px-1 mt-2"}
          >
            Принять
          </Button>
        </div>
      </div>
      <AdminToolsButton
        user={user}
        product={report.product}
        className="absolute top-0 right-2.5 cursor-pointer z-1"
      />
    </div>
  );
}
