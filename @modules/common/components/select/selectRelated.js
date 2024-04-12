import { useEffect } from "react";
import { useState } from "react";

import Input from "../input/input";

import OutsideAlerter from "hooks/useOutsideAlerter";
import SelectRelatedOption from "./part/selectRelatedOption";
import { isEnglishString, isRussianString } from "helpers/checkStringLanguage";

export default function SelectRelated({
  name,
  options,
  style,
  noChevron,
  placeholder,
  callback,
  minLength,
  topTitle,
}) {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === "" && query >= (minLength ? minLength : 3)
      ? options
      : options.filter((option) => {
          if (query) {
            const isEng = isEnglishString(query);

            if (isEng && option?.second_name) {
              return option.second_name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, ""));
            } else {
              return option.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, ""));
            }
          }
        });

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

  return (
    <>
      <div className="relative w-full group">
        <Input
          style={`${style}`}
          inputStyle={"bg-transparent"}
          placeholder={placeholder}
          onChange={inputOnChange}
          topTitle={topTitle}
        />

        {query.length >= (minLength ? minLength : 3) && show ? (
          <OutsideAlerter action={() => setShow(false)}>
            <div className="bg-white absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div
                  className={`relative select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md transition-all
                        text-blue`}
                >
                  Ничего не найдено.
                </div>
              ) : query.length >= (minLength ? minLength : 3) ? (
                filteredOptions.map((option) => {
                  if (option) {
                    return (
                      <SelectRelatedOption key={option.id} option={option} />
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
