import Image from "next/image";

import Button from "@modules/common/components/button/button";

import closeIcon from "public/icons/close-primary.svg";

import declension from "helpers/formatters/declension";
import Preloader from "@modules/common/components/preloader/preloader";

export default function FilterBottom({
  productsAmountLoading,
  productsAmount,
  isSidebar,
  clearFilter,
  startFilter,
}) {
  return (
    <div className="pt-2">
      <div
        className={`md:flex md:items-center md:w-full ${
          isSidebar ? "md:justify-center flex-col" : "md:justify-between"
        }`}
      >
        {isSidebar && (
          <Button onClick={startFilter} type="blue" className={"p-2"}>
            Показать
          </Button>
        )}

        {!isSidebar &&
          (!productsAmountLoading ? (
            <a
              href="#category-container"
              className="inline text-xs text-blue hover:text-primary"
            >
              Найдено {productsAmount}{" "}
              {declension(productsAmount, [
                "объявление",
                "объявления",
                "объявлений",
              ])}
            </a>
          ) : (
            <div className="w-[130px] h-[18px]">
              <Preloader />
            </div>
          ))}
        <br />
        <a
          className={`inline-flex items-center cursor-pointer md:justify-between`}
          onClick={() => clearFilter()}
        >
          <div
            className={`text-xs text-grey hover:text-blue transition-all ${
              isSidebar && "underline decoration-dotted underline-offset-4"
            }`}
          >
            Сбросить фильтры
          </div>

          {!isSidebar && (
            <svg
              className="fill-blue ml-2.5"
              width="7"
              height="7"
              viewBox="0 0 7 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.7866 0.713288C6.50221 0.428904 6.04105 0.428904 5.75714 0.713288L3.5 2.97062L1.24286 0.713288C0.958463 0.428904 0.497792 0.428904 0.213395 0.713288C-0.0710018 0.997672 -0.0710018 1.45832 0.213395 1.74271L2.47053 3.99994L0.213298 6.25727C-0.0710993 6.54165 -0.0710993 7.0023 0.213298 7.28669C0.355448 7.42883 0.541763 7.5 0.728079 7.5C0.914394 7.5 1.10091 7.42893 1.24286 7.28669L3.5 5.02945L5.75714 7.28669C5.89929 7.42883 6.08561 7.5 6.27192 7.5C6.45824 7.5 6.64445 7.42893 6.7867 7.28669C7.0711 7.0023 7.0711 6.54165 6.7867 6.25727L4.52946 4.00004L6.7866 1.7428C7.071 1.45842 7.071 0.997672 6.7866 0.713288Z" />
            </svg>
          )}
        </a>
      </div>
    </div>
  );
}
