import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import houses from "public/navbar/houses.svg";
import flats from "public/navbar/flats.svg";
import parking from "public/navbar/parking.svg";
import commertion from "public/navbar/commertion.svg";
import earth from "public/navbar/earth.svg";

import useSections from "hooks/sections/useSections";
import Preloader from "@modules/common/components/preloader/preloader";
import useIsPageLoaded from "hooks/useIsPageLoaded";
import MenuNoIconsItem from "./part/menuNoIconsItem";

export default function MenuWithIcons() {
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

  const menuList = useMemo(() => {
    if (!sections?.data?.length) return;

    return sections.data.map(({ name, id, slug }) => {
      let icon;
      if (name === "Квартиры") {
        icon = flats;
      }
      if (name === "Дома") {
        icon = houses;
      }
      if (name === "Земля") {
        icon = earth;
      }
      if (name === "Коммерция") {
        icon = commertion;
      }
      if (name === "Паркинги") {
        icon = parking;
      }

      return (
        <Link key={id} href={`/posts/${slug}`}>
          <li className={`w-1/5 list-none cursor-pointer`}>
            <div className="flex flex-col justify-between gap-3">
              <div className="lg:hidden text-center">
                <Image src={icon.src} width={50} height={50} />
              </div>
              <div className="text-exs md:text-sm text-center text-primary">
                {name}
              </div>
            </div>
          </li>
        </Link>
      );
    });
  }, [sections?.data]);

  return (
    <>
      {sections.isLoading ? (
        <div className="h-[136px] my-2.5">
          <Preloader />
        </div>
      ) : (
        <>
          <nav className="flex justify-between gap-3 mt-5 mb-4">{menuList}</nav>
          <div className="text-center mb-4">
            <MenuNoIconsItem
              name={"Подборки"}
              id={"99"}
              href={"/requests"}
              featured={true}
            />
          </div>
        </>
      )}
    </>
  );
}
