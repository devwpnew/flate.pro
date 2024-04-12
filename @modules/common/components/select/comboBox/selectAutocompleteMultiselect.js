import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useEffect } from "react";

export default function SelectMulti({
  name,
  options,
  style,
  noChevron,
  placeholder,
  callback,
}) {
  const [countSelectedTrigger, useCountSelectedTrigger] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selected, setSelected] = useState(options[0]);
  const [selectedArr, setSelectedArr] = useState([]);

  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  
  useEffect(() => {
    if (callback) {
      callback(() => selectedArr);
    }
  }, [selectedArr]);

  const changeSelectedArray = (value) => {
    if(value && value.id === 0) {
      setSelectedArr([]);
    }

    if (value && value.id !== 0) {
      useCountSelectedTrigger((val) => !val);
      const newSelectedArray = selectedArr;

      if (!selectedArr.includes(value.id)) {
        newSelectedArray.push(value.id);
        setSelectedArr(newSelectedArray);
      } else {
        const filtered = newSelectedArray.filter((item) => item !== value.id);
        setSelectedArr(filtered);
      }
    }
  };

  useEffect(() => {
    (async function countSelected() {
      setSelectedAmount(selectedArr.length);
    })();
  }, [countSelectedTrigger, selectedArr]);

  return (
    <>
      <Combobox
        value={selected}
        onChange={changeSelectedArray}
        defaultValue={options[0]}
      >
        <div className="relative w-full group">
          <div
            className={`flex px-2.5 border-greyborder group-hover:border-blue border rounded bg-white ${style} relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:shadow-lg transition-all`}
          >
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0 outline-none"
              // displayValue={(option) => option.name}
              placeholder={`${placeholder} ${
                selectedAmount > 0 ? `(${selectedAmount})` : ""
              }`}
              onChange={(event) => setQuery(event.target.value)}
            />
            {!noChevron && (
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-4 w-4"
                 
                />
              </Combobox.Button>
            )}
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4">
                  Ничего не найдено.
                </div>
              ) : (
                filteredOptions.map((option) => {
                  let active = false;
                  if (selectedArr.includes(option.id)) {
                    active = true;
                  }

                  return (
                    <Combobox.Option
                      key={option.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "text-blue" : "text-primary"
                        }`
                      }
                      value={option}
                    >
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.name}
                        </span>
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-blue block" : "text-primary hidden"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      </>
                    </Combobox.Option>
                  );
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <input hidden name={name} defaultValue={selected.id} />
    </>
  );
}
