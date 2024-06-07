import { useEffect } from "react";
import { useState } from "react";

import Input from "../input/inputGray";

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

                      function normalizeString(str) {
                          return str
                              .toLowerCase()
                              .replace(/улица|ул\.?/g, "") // Удаляем слова "улица" и "ул."
                              .replace(/\s*,\s*/g, ", ") // Убираем лишние пробелы вокруг запятых
                              .replace(/\s+/g, " ") // Заменяем множественные пробелы на один пробел
                              .trim(); // Убираем пробелы в начале и конце строки
                      }

					  function addCommaIfNecessary(query) {
						let normalizedQuery = normalizeString(query);
						
						// Добавляем запятую, если в запросе есть пробел между улицей и номером дома
						if (!normalizedQuery.includes(",")) {
							const lastSpaceIndex = normalizedQuery.lastIndexOf(" ");
							if (lastSpaceIndex !== -1) {
								normalizedQuery = normalizedQuery.slice(0, lastSpaceIndex) + ", " + normalizedQuery.slice(lastSpaceIndex + 1);
							}
						}
						
						return normalizedQuery;
					}

					if (isEng && option?.second_name) {
						// Нормализуем и вариант, и запрос для английского названия
						const normalizedOption = normalizeString(option.second_name);
						const normalizedQuery = addCommaIfNecessary(query);
				
						// Проверяем, содержит ли нормализованный вариант нормализованный запрос
						return normalizedOption.includes(normalizedQuery);
					} else {
						// Нормализуем и вариант, и запрос для русского названия
						const normalizedOption = normalizeString(option.name);
						const normalizedQuery = addCommaIfNecessary(query);
				
						// Проверяем, содержит ли нормализованный вариант нормализованный запрос
						return normalizedOption.includes(normalizedQuery);
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
                    inputStyle={
                        "bg-transparent text-center placeholder:text-backdrop/60"
                    }
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
                                            <SelectRelatedOption
                                                key={option.id}
                                                option={option}
                                            />
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
