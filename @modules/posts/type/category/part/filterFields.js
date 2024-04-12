import useFilterProps from "hooks/filter/useFilterProps";

import Preloader from "@modules/common/components/preloader/preloader";
import RangeSlider from "@modules/common/components/range/range-slider";

export default function FilterFields({ props, ranges, setFilter, filter }) {
  const propsToFetch = [];
  for (const fieldProperty in props) {
    propsToFetch.push(fieldProperty);
  }
  const propsRes = useFilterProps(propsToFetch);
  const template = [];
  for (const property in props) {
    const { isSidebar, Component, title, style, initialOption, isShow, value } =
      props[property];
    console.log(isSidebar);
    const getOptions = () => {
      if (initialOption && propsRes.data[property]) {
        return [initialOption, ...propsRes.data[property]];
      }

      if (!initialOption && propsRes.data[property]) {
        return [...propsRes.data[property]];
      }

      return [];
    };
    template.push(
      <>
        {isShow && (
          <div
            className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
              isSidebar ? "lg:w-[100%]" : ""
            }`}
          >
            <>
              {/* {!isSidebar && (
                <span className="hidden md:block text-grey text-sm">
                  {title}
                </span>
              )} */}

              <div
                className={`${style} min-h-[42px] ${
                  !isSidebar && "max-h-[42px]"
                }`}
              >
                {propsRes.isLoading ? (
                  <div className="w-full h-full">
                    <Preloader />
                  </div>
                ) : (
                  <Component
                    style={"h-[42px]"}
                    key={property + value}
                    options={getOptions()}
                    title={title}
                    name={property}
                    setFilter={setFilter}
                    filter={filter}
                    topTitle={title}
                    defaultValue={value}
                  />
                )}
              </div>
            </>
          </div>
        )}
      </>
    );
  }

  for (const property in ranges) {
    const { isSidebar, title, style, min, max, isShow, value } =
      ranges[property];

      template.push(
      <>
        {isShow && (
          <div
            className={`flex flex-col md:w-[32%] lg:w-[24%]  ${
              isSidebar ? "lg:w-[100%]" : ""
            }`}
          >
            {/* {!isSidebar && (
              <span className="hidden md:block text-grey text-sm">{title}</span>
            )} */}

            <div className={`${style} h-[42px]`}>
              {false ? (
                <div className="w-full h-full">
                  <Preloader />
                </div>
              ) : (
                <RangeSlider
                  key={property}
                  min={min}
                  max={max}
                  valueMin={value && value.from}
                  valueMax={value && value.to}
                  name={property}
                  setFilter={setFilter}
                  filter={filter}
                  topTitle={title}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
  return <>{template}</>;
}
