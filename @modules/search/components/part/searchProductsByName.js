import API from "pages/api/service/api";

import { useEffect } from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

import Input from "@modules/common/components/input/input";
import Link from "next/link";

import OutsideAlerter from "hooks/useOutsideAlerter";

export default function SearchProductsByName({
  name,
  options,
  style,
  noChevron,
  placeholder,
  callback,
  minLength,

  sectionId, areaIds
}) {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === "" && query >= (minLength ? minLength : 3)
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    if (callback) {
      const res = [];

      if (selected) {
        selected.map((e) => {
          res.push(e);
        });
      }
      callback(() => res);
    }
  }, [selected]);

  const inputOnChange = (event) => {
    setQuery(event.target.value);
    if (query.length >= (minLength ? minLength : 3)) {
      setSelected(filteredOptions);
    } else {
      setSelected([]);
    }
    setShow(true);
  };


  const fetchProducts = async (sectionId, areaIds, filteredOptions) => {
    const filterProductsFields = {
      published: "1",
    };

    filterProductsFields["link_city"] = activeCity;

    if (sectionId) {
      filterProductsFields["section_relation"] = sectionId;
    }

    if (areaIds && areaIds.length > 0) {
      filterProductsFields["area_link"] = areaIds;
    }

    const response = await API.get.product.list({
      window_host: window.location.origin,
      filter: filterProductsFields,
    })

    return response
  }

  useEffect(() => {
    (async function fetchData(sectionId, areaIds, filteredOptions) {
      setLoading(true);

      
      const products = await fetchProducts(sectionId, areaIds, filteredOptions)

      setLoading(false);
    })();
  }, [sectionId, areaIds]);

  // console.log(query);

  return (
    <>
      <div className="relative w-full group">
        <div
          className={`flex px-2.5 border-greyborder group-hover:border-blue border rounded bg-white ${style} relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:shadow-lg transition-all`}
        >
          <Input
            style="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none"
            placeholder={placeholder}
            onChange={inputOnChange}
          />
        </div>

        {query.length >= (minLength ? minLength : 3) && show ? (
          <OutsideAlerter action={() => setShow(false)}>
            <div className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4">
                  Ничего не найдено.
                </div>
              ) : query.length >= (minLength ? minLength : 3) ? (
                filteredOptions.map((option) => {
                  if (option) {
                    return (
                      <div
                        key={option.id}
                        className={`relative cursor-default select-none py-2 pl-10 pr-4 text-primary`}
                        value={option}
                      >
                        <Link
                          href={`posts/${option.section_relation[0].slug}/${option.slug}`}
                        >
                          <a
                            className={`inset-y-0 flex items-center text-primary hover:text-blue`}
                          >
                            {option.name}
                          </a>
                        </Link>
                      </div>
                    );
                  }
                })
              ) : (
                ""
              )}
            </div>
          </OutsideAlerter>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
