import { useMemo } from "react";

import houses from "public/navbar/houses.svg";
import flats from "public/navbar/flats.svg";
import parking from "public/navbar/parking.svg";
import commertion from "public/navbar/commertion.svg";
import earth from "public/navbar/earth.svg";

import MenuList from "../menu/menuList";
import Preloader from "@modules/common/components/preloader/preloader";

import useSections from "hooks/sections/useSections";

export default function MenuSidebar() {
  const sections = useSections(
    useMemo(() => {
      return {
        sort: {
          id: "asc",
        },
        filter: {
          active: true,
        },
      };
    }, [])
  );

  const menuItems = useMemo(() => {
    if (!sections?.data?.length) return;

    return sections.data.map((item, index) => {
      let icon;
      if (item.name === "Квартиры") {
        icon = flats;
      }
      if (item.name === "Дома") {
        icon = houses;
      }
      if (item.name === "Земля") {
        icon = earth;
      }
      if (item.name === "Коммерция") {
        icon = commertion;
      }
      if (item.name === "Паркинги") {
        icon = parking;
      }

      return <MenuList key={item.id} item={item} icon={icon} />;
    });
  }, [sections.data]);

  return (
    <div className="hidden lg:flex flex-col gap-2 pb-[20px] border-b border-greyborder">
      {sections.isLoading ? (
        <div className="h-[161px]">
          <Preloader />
        </div>
      ) : (
        <>{menuItems}</>
      )}
    </div>
  );
}
