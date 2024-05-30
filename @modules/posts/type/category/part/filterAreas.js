import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import AreasDropdown from "@modules/common/components/dropdown/areasDropdown";

import getLayout from "helpers/getLayout";

export default function FilterAreas({ filter, setFilter, isSidebar }) {
  const { DESKTOP } = getLayout();
  const filterGlobalFields = useSelector(
    (state) => state.filterGlobalFields.value
  );

  const router = useRouter();

  const [areaIds, setAreaIds] = useState(null);

  useEffect(() => {
    if (areaIds === null || areaIds === undefined) {
      if (JSON.stringify(filterGlobalFields) === "{}") {
        setFilter({
          ...filter,
        });
      } else {
        setFilter({
          ...filterGlobalFields,
        });
      }
    } else {
      if (JSON.stringify(filterGlobalFields) === "{}") {
        setFilter({
          ...filter,
          area_link: areaIds,
        });
      } else {
        setFilter({
          ...filterGlobalFields,
          area_link: areaIds,
        });
      }
    }
  }, [areaIds]);

  useEffect(() => {
    if (filterGlobalFields?.area_link) {
      setAreaIds(filterGlobalFields?.area_link);
    } else {
      setAreaIds(null);
    }
  }, []);

  // console.log(filterGlobalFields, "filterGlobalFields");
  return (
    <>
      {router.pathname !== "/rcs/[id]" && (
        <div
          className={`flex flex-col  ${
            isSidebar ? "lg:w-[100%]" : ""
          }`}
        >
          {/* {!isSidebar && (
                    <span className="hidden md:block text-grey text-sm">Район</span>
                  )} */}
          <AreasDropdown
            buttonClassName={"h-[42px] w-full"}
            setAreaIds={setAreaIds}
            areaIds={areaIds}
            returnActiveAreas={setAreaIds}
            topTitle={"Район"}
            isRight={
              (isSidebar && DESKTOP) ||
              router.query.section_slug === "commertion" ||
              router.query.section_slug === "parkings"
            }
          />
        </div>
      )}
    </>
  );
}
