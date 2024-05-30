import API from "pages/api/service/api";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";

import { FiSearch } from "react-icons/fi";
import { BsSliders } from "react-icons/bs";

import Preloader from "@modules/common/components/preloader/preloader";
import Button from "@modules/common/components/button/button";
import CitySelect from "@modules/location/components/button/select";
import SelectRelated from "@modules/common/components/select/selectRelated";
import SelectLinks from "@modules/common/components/select/listBox/selectLinks";
import AreasDropdown from "@modules/common/components/dropdown/areasDropdown";
import { setFetchState } from "store/global/helpers/fetchTrigger";
import { setFilterVisibility } from "store/global/filter/filterVisibility";
import Link from "next/link";

export default function SearchForm(className) {
    const filterVisibility = useSelector(
        (state) => state.filterVisibility.value
    );
    const fetchState = useSelector((state) => state.fetchTrigger.value);
    const router = useRouter();
    const dispatch = useDispatch();

    const activeCity = useSelector((state) => state.userCity.value);
    const filterFields = useSelector((state) => state.filterGlobalFields.value);

    const [isLoading, setLoading] = useState(true);

    const [areaIds, setAreaIds] = useState(false);

    const [sections, setSections] = useState(null);

    const [filter, setFilter] = useState({
        published: "1",
        section_relation: 3,
    });

    const [rcList, serRcList] = useState(false);

    // SECTIONS
    useEffect(() => {
        (async function fetchData() {
            setLoading(true);

            const result = await API.get.sections({
                window_host: window.location.origin,
                sort: {
                    id: "asc",
                },
                filter: {
                    active: true,
                },
            });

            if (result) {
                const sectionsWithQuery = result.map((el) => {
                    el.slug = el.slug + "?row=1";
                    return el;
                });

                setSections(sectionsWithQuery);
            }

            const rcList = await API.get.rcs({
                filter: { published: "1", city_link: activeCity.id },
                limit: "all",
            });

            if (rcList?.length > 0) {
                serRcList(rcList);
            } else {
                serRcList([{ name: "", id: null }]);
            }

            setLoading(false);
        })();
    }, [activeCity]);
    // AREAS
    // useEffect(() => {
    //   if (areaIds) {
    //     setFilter({
    //       ...filter,
    //       area_link: areaIds,
    //     });
    //   }
    // }, [areaIds]);

    // useEffect(() => {
    //   if (filterFields?.area_link) {
    //     setAreaIds(filterFields?.area_link);
    //   } else {
    //     setAreaIds(false);
    //   }
    // }, [filterFields]);

    const startFilter = () => {
        dispatch(setFilterGlobalFields(filter));
        const isRow = router?.query?.row;
        const slug = router?.query?.section_slug;
        const pSlug = router?.query?.product_slug;

        if (slug && isRow && !pSlug) {
            dispatch(setFetchState(!fetchState));
        } else {
            router.push({
                pathname: `/posts/${slug ? slug : "flats"}`,
                query: { row: 1 },
            });
        }
    };
    const onSearchFormSubmit = (ev) => {
        ev.preventDefault();
        startFilter();
    };

    const isNotMainPage =
        router.route !== "/" &&
        router.route !== "/sochi" &&
        router.route !== "/flat" &&
        router.route !== "/home" &&
        router.route !== "/main" &&
        router.route !== "/my";

    return (
        <div className="flex gap-[10px] md:gap-[20px] items-center w-full text-[14px] justify-between">
            {/* <a href="/posts/flats">
                <div className="bg-[#ECF2F8] text-backdrop rounded-[10px] px-[13px] py-[3px] h-10 flex">
                    <p className="m-auto">Поиск</p>
                </div>
            </a> */}

            <form className="w-full" onSubmit={onSearchFormSubmit}>
                <div className="w-full">
                    <div>
                        {/* <div
              className={`${
                isNotMainPage && "hidden lg:block"
              }  lg:block md:w-[188px] h-11 w-full`}
            >
              {isLoading && !sections ? (
                <Preloader />
              ) : (
                <SelectLinks
                  type="sections"
                  style={"w-full h-11"}
                  toCategory={true}
                  options={sections}
                  // defaultOption={}
                  topTitle={isNotMainPage && "Тип"}
                />
              )}
            </div> */}
                        <div className={`h-10 w-full relative`}>
                            {isLoading ? (
                                <Preloader />
                            ) : (
                                <>
                                    {/* <svg
                                        className="absolute left-2.5 top-[12px] w-5 h-5 z-[11] fill-greyC4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        />
                                    </svg> */}
                                    <SelectRelated
                                        placeholder={`По названию ЖК`}
                                        style={`w-full h-10 rounded-full md:rounded-[10px] bg-[#ECF2F8] border-0 ${className}`}
                                        name={"rcs"}
                                        minLength={3}
                                        options={rcList}
                                        noChevron={true}
                                        // callback={setProductsIds}
                                        //topTitle={isNotMainPage && "Название ЖК"}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div
                        className={`${
                            isNotMainPage ? "hidden lg:flex" : "flex gap-2"
                        } md:flex-row mb:w-full md:gap-1`}
                    >
                        {/* <div className="md:w-[188px] w-full h-11">
              {isLoading ? (
                <Preloader />
              ) : (
                <>
                  <CitySelect
                    style={"w-full h-11"}
                    topTitle={isNotMainPage && "Город"}
                  />
                </>
              )}
            </div> */}
                        {/* <div className="md:w-[188px] w-full h-11">
              {isLoading ? (
                <Preloader />
              ) : (
                <div className="relative">
                  <AreasDropdown
                    buttonClassName={"h-11 w-full"}
                    returnActiveAreas={setAreaIds}
                    areaIds={areaIds}
                    topTitle={isNotMainPage && "Район"}
                  />
                </div>
              )}
            </div> */}
                    </div>
                </div>

                {/* <div
          className={`${
            isNotMainPage && "hidden lg:block"
          } mt-2 lg:mt-0 lg:block lg:max-w-[130px] lg:w-full h-11`}
        >
          {isLoading ? (
            <Preloader />
          ) : (
            <Button
              onClick={startFilter}
              className={router.asPath === "/" && "font-bold"}
            >
              Найти
            </Button>
          )}
        </div> */}
            </form>

            <a href="/posts/flats">
                <p className="hidden md:flex m-auto whitespace-nowrap md:mr-[20px] text-sm">
                    Расширенный поиск
                </p>

                <div className="md:hidden bg-[#ECF2F8] h-10 w-10 rounded-full flex"><BsSliders className="text-md m-auto" /></div>
            </a>

            {/* {isNotMainPage && !router.route.includes("/users/") ? (
        <div className="flex justify-center py-2.5 lg:hidden">
          <button
            onClick={() => dispatch(setFilterVisibility(!filterVisibility))}
            className="flex items-center gap-2.5 group"
          >
            <FilterIcon />
          </button>
        </div>
      ) : (
        ""
      )} */}
        </div>
    );
}

function FilterIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-blue group-hover:fill-blue"
        >
            <g clipPath="url(#clip0_1476_22287)">
                <path d="M0.625 3.52566H10.1408C10.4276 4.83109 11.5934 5.81113 12.9837 5.81113C14.374 5.81113 15.5398 4.83113 15.8266 3.52566H19.375C19.7202 3.52566 20 3.24582 20 2.90066C20 2.55551 19.7202 2.27566 19.375 2.27566H15.8263C15.5389 0.970898 14.3716 -0.00976562 12.9837 -0.00976562C11.5951 -0.00976562 10.4283 0.970742 10.1411 2.27566H0.625C0.279844 2.27566 0 2.55551 0 2.90066C0 3.24582 0.279844 3.52566 0.625 3.52566ZM11.3233 2.9023C11.3233 2.90008 11.3234 2.89781 11.3234 2.89559C11.3261 1.98281 12.0709 1.24027 12.9837 1.24027C13.8952 1.24027 14.6401 1.9818 14.644 2.89414L14.6441 2.90332C14.6427 3.81766 13.8984 4.56117 12.9837 4.56117C12.0694 4.56117 11.3254 3.8184 11.3233 2.90461L11.3233 2.9023ZM19.375 16.4741H15.8263C15.5389 15.1694 14.3716 14.1887 12.9837 14.1887C11.5951 14.1887 10.4283 15.1693 10.1411 16.4741H0.625C0.279844 16.4741 0 16.7539 0 17.0991C0 17.4443 0.279844 17.7241 0.625 17.7241H10.1408C10.4276 19.0296 11.5934 20.0096 12.9837 20.0096C14.374 20.0096 15.5398 19.0296 15.8266 17.7241H19.375C19.7202 17.7241 20 17.4443 20 17.0991C20 16.7539 19.7202 16.4741 19.375 16.4741ZM12.9837 18.7596C12.0694 18.7596 11.3254 18.0168 11.3233 17.103L11.3233 17.1008C11.3233 17.0985 11.3234 17.0963 11.3234 17.0941C11.3261 16.1813 12.0709 15.4387 12.9837 15.4387C13.8952 15.4387 14.6401 16.1802 14.644 17.0925L14.6441 17.1017C14.6428 18.0162 13.8985 18.7596 12.9837 18.7596ZM19.375 9.37492H9.85918C9.57238 8.06949 8.4066 7.08949 7.01629 7.08949C5.62598 7.08949 4.4602 8.06949 4.1734 9.37492H0.625C0.279844 9.37492 0 9.65477 0 9.99992C0 10.3451 0.279844 10.6249 0.625 10.6249H4.17371C4.46109 11.9296 5.62844 12.9104 7.01629 12.9104C8.40488 12.9104 9.57172 11.9298 9.85895 10.6249H19.375C19.7202 10.6249 20 10.3451 20 9.99992C20 9.65477 19.7202 9.37492 19.375 9.37492ZM8.67668 9.99828C8.67668 10.0005 8.67664 10.0028 8.67664 10.005C8.67391 10.9178 7.9291 11.6603 7.01629 11.6603C6.10477 11.6603 5.35992 10.9188 5.35598 10.0065L5.35586 9.99734C5.35723 9.08289 6.10156 8.33949 7.01629 8.33949C7.93059 8.33949 8.67465 9.08223 8.67672 9.99605L8.67668 9.99828Z"></path>
            </g>
            <defs>
                <clipPath id="clip0_1476_22287">
                    <rect width="20" height="20" fill="white"></rect>
                </clipPath>
            </defs>
        </svg>
    );
}
