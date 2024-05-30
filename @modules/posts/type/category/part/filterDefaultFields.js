import API from "pages/api/service/api";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Preloader from "@modules/common/components/preloader/preloader";
import SelectLinks from "@modules/common/components/select/listBox/selectLinks";
import CitySelect from "@modules/location/components/button/select";

export default function FilterDefaultFields({ filter, isSidebar, setFilter }) {
  const activeCity = useSelector((state) => state.userCity.value);

  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    (async function fetchSections() {
      setSectionsLoading(true);
      setSections(
        await API.get.sections({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
          filter: {
            active: true,
          },
        })
      );
      setSectionsLoading(false);
    })();
  }, [activeCity]);

  return (
    <>
      {!isSidebar && (
        <div
          className={`flex flex-col w-full`}
        >
          {/* {!isSidebar && (
            <span className="hidden md:block text-grey text-sm">Тип</span>
          )} */}
          <div className="w-full h-[42px]">
            {sectionsLoading ? (
              <div className="w-full h-full">
                <Preloader />
              </div>
            ) : (
              <SelectLinks options={sections} topTitle={"Тип"} />
            )}
          </div>
        </div>
      )}
      {!isSidebar && (
        <></>
        // <div
        //   className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
        //     isSidebar ? "lg:w-[100%]" : ""
        //   }`}
        // >
        //   {/* {!isSidebar && (
        //   <span className="hidden md:block text-grey text-sm">Город</span>
        // )} */}
        //   <div className="w-full h-[42px]">
        //     <CitySelect topTitle={"Город"} />
        //   </div>
        // </div>
      )}
    </>
  );
}
