import api from "pages/api/service/api";
import { useState, useEffect } from "react";
import Link from "next/link";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import TablePreloader from "@modules/common/components/preloader/tablePreloader";
export default function CitiesAreasList({ cityId }) {
  if (cityId == "add") return;

  const [fetchDistricts, setFetchDistricts] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(true);
  const [districts, setDistricts] = useState(null);

  useEffect(() => {
    (async function getCityRelatedDistricts() {
      setIsDistrictsLoading(true);
      setDistricts(
        await api.get.areas({
          window_host: window.location.origin,
          select: ["id", "name"],
          limit: "all",
          filter: {
            link_city: cityId,
          },
        })
      );
      setIsDistrictsLoading(false);
    })();
  }, [fetchDistricts]);

  const deleteAreaItem = async (areaId) => {
    const res = await api.remove.areas(areaId);
    if (res) {
      setFetchDistricts(!fetchDistricts);
    }
  };

  return (
    <>
      <div className="font-bold mb-2.5 text-sm">Районы</div>
      <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10  mt-2.5">
        <table className="w-full border-separate border-spacing-2">
          <tbody>
            <tr>
              <td className="whitespace-nowrap text-grey text-xs px-2 pb-3">
                ID
              </td>
              <td className="whitespace-nowrap text-grey text-xs px-2 pb-3">
                Заголовок
              </td>
              <td className="whitespace-nowrap text-grey text-xs px-2 pb-3">
                Публикация
              </td>
            </tr>
            {!isDistrictsLoading ? (
              districts && districts?.length !== 0 ? (
                districts.map((item) => {
                  return (
                    <tr className="relative group" key={item.name + item.id}>
                      <td className="px-2 align-top">{item.id}</td>
                      <td className="px-2 align-top">{item.name}</td>
                      <Link href={`/user/admin/districts/areas/${item.id}`}>
                        <td className="px-2 align-top cursor-pointer hover:text-blue">
                          Редактировать
                        </td>
                      </Link>
                      <td
                        className="px-2 align-top cursor-pointer hover:text-blue"
                        onClick={() => deleteAreaItem(item.id)}
                      >
                        Удалить
                      </td>
                      <span className="absolute bottom-[0] left-[0] h-[1px] w-full group-hover:bg-greyborder"></span>
                    </tr>
                  );
                })
              ) : (
                <div className="text-center">
                  Районы отсутствуют...
                  <br />
                  <Link href={"/user/admin/districts/areas/add"}>
                    <a className="text-blue hover:underline ring-offset-2">
                      Добавить новый район?
                    </a>
                  </Link>
                </div>
              )
            ) : (
              <TablePreloader cols={3} amount={10} />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
