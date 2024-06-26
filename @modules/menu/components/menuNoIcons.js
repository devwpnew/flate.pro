import { useMemo } from "react";

import Preloader from "@modules/common/components/preloader/preloader";
import MenuNoIconsItem from "./part/menuNoIconsItem";

import useSections from "hooks/sections/useSections";
import useIsPageLoaded from "hooks/useIsPageLoaded";

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

  return (
    <>
      <nav className="hidden lg:flex items-center h-full w-full ml-1">
        {sections.isLoading
          ? [1, 2, 3, 4, 5].map((el) => (
              <div className="w-[96px] h-[37px] mr-[12px]">
                <Preloader />
              </div>
            ))
          : sections?.data.map(({ name, id, slug }, index) => (
              <MenuNoIconsItem
                key={id + index}
                name={name}
                id={id}
                slug={slug}
              />
            ))}
        <MenuNoIconsItem
          name={"Подборки"}
          id={"99"}
          href={"/requests"}
          featured={true}
        />
      </nav>
    </>
  );
}
