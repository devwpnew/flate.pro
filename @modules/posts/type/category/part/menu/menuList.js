import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import randomInteger from "helpers/randomInteger";
import Link from "next/link";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuList({ item, icon }) {
  const [activeMenu, setActiveMenu] = useState(false);
  const router = useRouter();
  const topLvlItemLink = `/posts/${item.slug}`;

  useEffect(() => {
    if (router.asPath === topLvlItemLink) {
      setActiveMenu(true);
    } else {
      setActiveMenu(false);
    }
  }, [router.asPath]);

  const printChildren = () => {
    if (item.children) {
      item.children.map((item) => {
        return (
          <div>
            <a
              href={`/posts/${item.slug}`}
              className={classNames(
                activeMenu
                  ? "text-sm text-blue"
                  : "text-sm text-blue hover:underline underline-offset-2"
              )}
            >
              {item.name}
            </a>
          </div>
        );
      });
    }
  };
  // TODO: ACTIVE MENU
  // console.log(icon);
  return (
    <div className={`flex flex-col ${activeMenu ? "gap-2.5" : "row-gap-2.5"}`}>
      <div className="flex items-center gap-2.5 cursor-default">
        {item.children && (
          <div className={`${item.children ? "opacity-1" : "opacity-0"}`}>
            <ChevronDownIcon
              className="-mr-1 ml-2 h-3 w-3 cursor-pointer"
              onClick={() => setActiveMenu(!activeMenu)}
            />
          </div>
        )}

        <Link href={topLvlItemLink}>
          <a className={`text-sm ${activeMenu ? "text-blue" : ""}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-[30px] h-[30px]">
                <Image src={icon.src} width={icon.width} height={icon.height} />
              </div>

              {item.name}
            </div>
          </a>
        </Link>
      </div>

      {item.children ? (
        <li
          className={`${
            activeMenu
              ? "pl-9 gap-2.5 opacity-1 h-auto z-0"
              : "opacity-0 h-0 -z-10"
          } flex flex-col transition-all duration-300`}
        >
          {item.children.map((item) => {
            return (
              <div>
                <a
                  href={`/posts/${item.slug}`}
                  className={"text-sm hover:underline underline-offset-2"}
                >
                  {item.name}
                </a>
              </div>
            );
          })}
        </li>
      ) : (
        ""
      )}
    </div>
  );
}
